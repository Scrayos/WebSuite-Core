"use strict";

class GroupEdit {

	static listen() {
		// TODO: Rewrite for Group Edit
		WebSuite.getWebSocketHandler().registerCpEvent("cp-group-edit-permissions", (socket, data) => {
			global.FileUtil.readFile(`${global._dir}/data/permissionsList/administrativePermissions.json`).then((contentCP) => {
				global.FileUtil.readFile(`${global._dir}/data/permissionsList/permissions.json`).then((content) => {
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-edit-permissions", {cp: JSON.parse(contentCP), frontend: JSON.parse(content)});
				}).catch((err) => {
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-edit-permissions", {err});
				});
			}).catch((err) => {
				WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-edit-permissions", {err});
			});
		});
		WebSuite.getWebSocketHandler().registerCpEvent("cp-group-edit", (socket, data) => {
			let groupID = 1;
			if(data.groupID && data.groupID > 0) {
				groupID = data.groupID;
			}

			WebSuite.getDatabase().query("SELECT * FROM wsGroup WHERE groupID=?", [groupID]).then((result) => {
				WebSuite.getDatabase().query("SELECT permission FROM wsGroupPermissions WHERE groupID=?", [groupID]).then((permissions) => {
					let perms = [];
					for(let permission of permissions) {
						perms.push(permission.permission);
					}
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-edit", {defaults: result[0], permissions: perms});
				}).catch((err) => {
					// number is a signal to know where the error occurred.
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-edit", {err, number: 2});
				});
			}).catch((err) => {
				WebSuite.getWebSocketHandler().sendToClient(socket, "cp-group-edit", {err, number: 1});
			});
		});

		WebSuite.getWebSocketHandler().registerCpEvent("cp-save-group-edit", (socket, data) => {
			WebSuite.getDatabase().query("UPDATE wsGroup SET groupName=?, groupDescription=?, displayName=?, displayColor=?, fontColor=? WHERE groupID=?", [data.defaults.groupName, data.defaults.groupDescription, data.defaults.displayName, data.defaults.displayColor, data.defaults.fontColor, data.defaults.groupID]).then((success) => {
				WebSuite.getDatabase().query("SELECT permission FROM wsGroupPermissions WHERE groupID=?", [data.defaults.groupID]).then((permissions) => {
					let perms = [];
					for(let permission of permissions) {
						perms.push(permission.permission);
					}

					// Check for removed and added permissions
					let added = [];
					let removed = [];

					for(const permission of data.permissions) {
						if(!perms.includes(permission)) {
							added.push([data.defaults.groupID, permission]);
						}
					}
					for(const permission of perms) {
						if(!data.permissions.includes(permission)) {
							removed.push([data.defaults.groupID, permission]);
						}
					}

					if(added.length !== 0) {
						WebSuite.getDatabase().query("INSERT INTO wsGroupPermissions(groupID, permission) VALUES ?", [added]).then(() => {

						}).catch((err) => {
							console.log("2: " + err.message);
							WebSuite.getWebSocketHandler().sendToClient(socket, "cp-save-group-edit", {err, number: 2});
						});
						if(removed.length !== 0) {
							WebSuite.getDatabase().query("DELETE FROM wsGroupPermissions WHERE (groupID, permission) IN (?)", [removed]).then(() => {
								console.log("updated successfully");
							}).catch((err) => {
								WebSuite.getWebSocketHandler().sendToClient(socket, "cp-save-group-edit", {err, number: 3});
							});
						} else {
							WebSuite.getWebSocketHandler().sendToClient(socket, "cp-save-group-edit", {});
						}
					} else {
						if(removed.length !== 0) {
							WebSuite.getDatabase().query("DELETE FROM wsGroupPermissions WHERE (groupID, permission) IN (?)", [removed]).then(() => {
								console.log("updated successfully");
							}).catch((err) => {
								WebSuite.getWebSocketHandler().sendToClient(socket, "cp-save-group-edit", {err, number: 3});
							});
						} else {
							WebSuite.getWebSocketHandler().sendToClient(socket, "cp-save-group-edit", {});
						}
					}
				}).catch((err) => {
					console.log("1: " + err.message);
					// number is a signal to know where the error occurred.
					WebSuite.getWebSocketHandler().sendToClient(socket, "cp-save-group-edit", {err, number: 1});
				});
			}).catch((err) => {
				console.log(err.message);
				WebSuite.getWebSocketHandler().sendToClient(socket, "cp-save-group-edit", {err, number: 0});
			});
		});
	}

}

module.exports = GroupEdit;