import { NPMPackage } from "./types";
import got from "got";

export async function _getTransitive(name: string, version: string) {
  try {
    const npmPackage: NPMPackage = await got(
      `https://registry.npmjs.org/${name}`
    ).json();
    var dependencies = npmPackage.versions[version]
      ? npmPackage.versions[version].dependencies
      : undefined;
    const res: any = { name, dependencies };
    if (dependencies && !Object.keys(dependencies).length) {
      dependencies = undefined;
    } else if (dependencies && Object.keys(dependencies).length) {
      for (var key in dependencies) {
        var _version = isNaN(Number(dependencies[key][0]))
          ? dependencies[key].slice(1)
          : dependencies[key];
        //recursive finding deppendencies.
        res.dependencies[key] = await _getTransitive(key, _version);
      }
    }

    return { name, version, dependencies };
  } catch (error) {
    console.log(error);
  }
}
