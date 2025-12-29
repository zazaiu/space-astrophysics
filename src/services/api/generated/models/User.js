export var User;
(function (User) {
    let role;
    (function (role) {
        role["GUEST"] = "guest";
        role["ASTRONAUT"] = "astronaut";
        role["MISSION_CONTROL"] = "mission_control";
    })(role = User.role || (User.role = {}));
})(User || (User = {}));
