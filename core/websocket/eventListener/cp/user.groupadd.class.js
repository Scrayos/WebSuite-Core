"use strict";

class GroupAdd {

	static listen() {
		WebSuite.getWebSocketHandler().registerCpEvent("cp-group-add-permissions", (socket, data) => {
			global.FileUtil.readFile(`${global._dir}/data/permissionsList/administrativePermissions.json`).then((contentCP) => {
				global.FileUtil.readFile(`${global._dir}/data/permissionsList/permissions.json`).then((content) => {
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-add-permissions", {cp: JSON.parse(contentCP), frontend: JSON.parse(content)});
				}).catch((err) => {
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-add-permissions", {err});
				});
			}).catch((err) => {
				WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-add-permissions", {err});
			});
		});
		WebSuite.getWebSocketHandler().registerCpEvent("cp-group-add", (socket, data) => {
			WebSuite.getDatabase().query("INSERT INTO wsGroup(groupName, groupDescription, displayName, displayColor, fontColor) VALUES (?, ?, ?, ?, ?)", [data.defaults.name, data.defaults.description, data.defaults.displayname, data.defaults.displaycolor, data.defaults.fontcolor]).then((result) => {
				let permissions = [];
				for(let permission of data.permissions) {
					permissions.push([result.insertId, permission]);
				}
				WebSuite.getDatabase().query("INSERT INTO wsGroupPermissions(groupID, permission) VALUES ?", [permissions]).then((success) => {
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-add", {});
				}).catch((err) => {
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-add", {err});
				});
			}).catch((err) => {
				WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-add", {err});
			});
		});
	}

}

module.exports = GroupAdd;