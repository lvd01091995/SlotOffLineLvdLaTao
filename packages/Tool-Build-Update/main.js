'use strict';
var path = require('path');
var fs = require('fs');
var rimraf = require("rimraf");
var crypto = require('crypto');

var mangUrl = [];
var urlSave = "";
var urlProject = '';
var URLs_SubPack = [];
var proManUid = "";
// sua thong tin hot update 
var versionUpdate = "1.0.0";
 var linkHotUpdate = "http://192.168.1.97:8080/";
//var linkHotUpdate = "http://192.168.1.50:8700/";
// su thong tin hotupdate end
var manifest = {
  packageUrl: linkHotUpdate,
  remoteManifestUrl: linkHotUpdate + 'project.manifest',
  remoteVersionUrl: linkHotUpdate + 'version.manifest',
  version: versionUpdate,
  assets: {},
  searchPaths: []
};
//https://storage.googleapis.com/s.ngwcasino.com/asset/js/ios/ngw_purple_43/
var dest = './remote-assets/';
var src = './jsb/';

function readDir2(dir, obj) {
  var stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    return;
  }
  var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
  for (var i = 0; i < subpaths.length; ++i) {
    if (subpaths[i][0] === '.') {
      continue;
    }
    subpath = path.join(dir, subpaths[i]);
    stat = fs.statSync(subpath);
    if (stat.isDirectory()) {
      readDir2(subpath, obj);
    }
    else if (stat.isFile()) {
      // Size in Bytes
      size = stat['size'];
      md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
      compressed = path.extname(subpath).toLowerCase() === '.zip';

      relative = path.relative(src, subpath);
      relative = relative.replace(/\\/g, '/');
      relative = encodeURI(relative);

      obj[relative] = {
        'size': size,
        'md5': md5
      };
      if (compressed) {
        obj[relative].compressed = true;
      }
    }
  }
}
var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code != 'EEXIST') throw e;
  }
}
function createManifest(options) {
  dest = options.dest;
  src = options.dest;
  readDir2(path.join(src, 'src'), manifest.assets);
  readDir2(path.join(src, 'res'), manifest.assets);

  var destManifest = path.join(dest, 'project.manifest');
  var destVersion = path.join(dest, 'version.manifest');

  mkdirSync(dest);

  fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    Editor.log('Generate duoc roi day ku');
    editFileProMan(options);
  });

  delete manifest.assets;
  delete manifest.searchPaths;

  fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    Editor.log('Generate duoc roi day ku');
  });
  manifest = {
    packageUrl: linkHotUpdate,
    remoteManifestUrl: linkHotUpdate + 'project.manifest',
    remoteVersionUrl: linkHotUpdate + 'version.manifest',
    version: versionUpdate,
    assets: {},
    searchPaths: []
  };
}
function onBuildFinished(options) {
  createManifest(options);
}
function getProjecManifestGen(options) {
  var projManiPath = path.join(options.dest, "/project.manifest");
  return projManiPath;
}
function onBeforeChangeFile(options) {
  let projectManifestPath = options.project + "/assets/project.manifest.meta";
  getProjectManifestUid(projectManifestPath);
}
function getProjectManifestUid(path) {
  let content = JSON.parse(fs.readFileSync(path));
  proManUid = content.uuid;
}
function editFileProMan(options) {
  let tiento = proManUid.slice(0, 2);
  let pathRawProjMan = path.join(options.dest, '/res/raw-assets/' + tiento + "/" + proManUid + ".manifest");
  fs.unlinkSync(pathRawProjMan);
  let proManGenPath = getProjecManifestGen(options);
  Editor.log('proManGenPath======' + proManGenPath);
  let proManAssetFile = fs.readFileSync(proManGenPath);
  Editor.log('proManAssetFile======' + proManAssetFile);
  fs.writeFile(pathRawProjMan, proManAssetFile);
}
function onBeforeBuildFinish(options, callback) {
  URLs_SubPack.forEach(temp => {
    temp.meta.isSubpackage = true;
    Editor.assetdb.saveMeta(temp.uuid, JSON.stringify(temp.meta), (err, meta) => {
    })
    rimraf.sync(urlSave + "/" + temp.name);
  })
  URLs_SubPack.forEach(temp => {
    mangUrl = [];
    getUrlFileFromDir(temp.url);
    mkdirsSync(urlSave + "/" + temp.name + "/src");
    mkdirsSync(urlSave + "/" + temp.name + "/res");
    getUrlFileFromDirBuildRes(urlSave + "/res/raw-assets", urlSave + "/" + temp.name);
    getUrlFileFromDirBuildImport(urlSave + "/res/import", urlSave + "/" + temp.name);
  })
  //xoa xong raw  assets;
  onBuildFinished(options);
  callback();
}

function Loc(fileName) {
  var arrLoc = [".meta", ".json", ".atlas"];
  var name = path.extname(fileName);
  if (arrLoc.includes(name)) return false;
  return true;
}

function getUrlFileFromDir(str) {
  fs.readdirSync(str).forEach(file => {
    let tempUrl = str + "/" + file;
    var stats = fs.statSync(tempUrl);

    if (stats.isDirectory()) {
      getUrlFileFromDir(str + "/" + file);
    } else if (stats.isFile()) {
      if (Loc(file)) {
        let temp = str.replace(urlProject, "db:/");
        let temp2 = temp + "/" + file;
        // Editor.log(temp2);
        mangUrl.push(Editor.assetdb.urlToUuid(temp2));
        // mangUrl.push(temp2);
      }

    }
  });
}
function getUrlFileFromDirBuildRes(str, strGen) {
  fs.readdirSync(str).forEach(file => {
    let urltemp = str + "/" + file
    fs.readdirSync(urltemp).forEach(filee => {
      var stats = fs.statSync(urltemp + "/" + filee).isFile();
      if (stats) {
        mangUrl.forEach((temp) => {
          let strTemp = filee.split('.')[0]
          if (temp == strTemp) {
            let creatUrl = strGen + "/res/raw-assets/" + strTemp.slice(0, 2)
            mkdirsSync(creatUrl);
            fs.rename(urltemp + "/" + filee, creatUrl + "/" + filee);
          }
        })
      }

    })
  });

}
function getUrlFileFromDirBuildImport(str, strGen) {
  fs.readdirSync(str).forEach(file => {
    let urltemp = str + "/" + file
    fs.readdirSync(urltemp).forEach(filee => {
      var stats = fs.statSync(urltemp + "/" + filee).isFile();
      if (stats) {
        mangUrl.forEach((temp) => {
          let strTemp = filee.split('.')[0]
          if (temp == strTemp) {
            let creatUrl = strGen + "/res/import/" + strTemp.slice(0, 2)
            mkdirsSync(creatUrl);
            fs.rename(urltemp + "/" + filee, creatUrl + "/" + filee);
          }
        })
      }

    })
  });

}
function getSubCode(src, url, name, url2) {
  fs.readdirSync(src).forEach(file => {
    let urltemp = src + "/" + file;
    var stats = fs.statSync(urltemp).isFile();
    if (stats && name == file.split(".")[0]) {
      let creatUrl = url + "/src/assets" + url2;
      mkdirsSync(creatUrl);
      fs.rename(urltemp, creatUrl + "/" + file);
    }
  })
}

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
function getUrlSubPack(urlProject) {
  fs.readdirSync(urlProject).forEach(file => {
    let tempUrl = urlProject + "/" + file;
    var stats = fs.statSync(tempUrl);
    if (stats.isDirectory()) {
      var strTemp = fs.readFileSync(tempUrl + ".meta");
      var strParse = JSON.parse(strTemp);
      let nameSub = strParse.subpackageName
      if (strParse.isSubpackage && nameSub != "Game") {

        let temp = {};
        temp.name = nameSub;
        temp.nameScritp = file;
        temp.url = tempUrl;
        temp.meta = strParse;
        temp.uuid = strParse.uuid;
        URLs_SubPack.push(temp);
        strParse.isSubpackage = false;
        //  fs.writeFileSync(tempUrl +".meta", JSON.stringify(strParse));
        Editor.assetdb.saveMeta(strParse.uuid, JSON.stringify(strParse), (err, meta) => {
        })
        //   Editor.log( "=== " +  fs.readFileSync(tempUrl +".meta" , "utf8"));

      }
      getUrlSubPack(urlProject + "/" + file);
    }
  });
}
function unCheckSub(options, callback) {
  URLs_SubPack = [];
  urlSave = options.dest.replace(/\\/g, "/");
  urlProject = options.buildPath.slice(0, options.buildPath.length - 6).replace(/\\/g, "/");
  getUrlSubPack(urlProject + "/assets");
  onBeforeChangeFile(options)
  callback();
}
module.exports = {
  load() {
    Editor.Builder.on('build-finished', onBeforeBuildFinish);
    Editor.Builder.on('build-start', unCheckSub);
  },

  unload() {
    Editor.Builder.removeListener('build-finished', onBeforeBuildFinish);
    Editor.Builder.removeListener('build-start', unCheckSub);
  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('Test');
    },
    'say-hello'() {
      //  Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('Test', 'Test:hello');
    },
    'clicked'() {
      //  Editor.log('Button clicked!');
    }
  },
};