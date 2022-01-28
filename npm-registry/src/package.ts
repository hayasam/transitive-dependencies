import { RequestHandler } from "express";
import got from "got";
import { NPMPackage } from "./types";
import { _getTransitive } from "./transitive";
/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  try {
    const npmPackage: NPMPackage = await got(
      `https://registry.npmjs.org/${name}`
    ).json();

    const dependencies = npmPackage.versions[version].dependencies;
    //finding the transitive dependencies of the package
    const transitiveDependencies: object[] = [];
    if (dependencies && Object.keys(dependencies).length) {
      for (var key in dependencies) {
        var _version = isNaN(Number(dependencies[key][0]))
          ? dependencies[key].slice(1)
          : dependencies[key];
        var transitiveDependencie = await _getTransitive(key, _version);
        if (transitiveDependencie && transitiveDependencie.dependencies) {
          transitiveDependencies.push(transitiveDependencie);
        } else {
          transitiveDependencies.push({});
        }
      }
    }
    console.log(transitiveDependencies);
    
    return res
      .status(200)
      .json({ name, version, dependencies, transitiveDependencies });
  } catch (error) {
    return next(error);
  }
};
