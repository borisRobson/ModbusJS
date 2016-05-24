


//home page
exports.home = function (req, res) {
    res.render('home', {
        title: "Modbus Controller"
    });
};
//isma View
exports.isma = function (req, res) {
    res.render('ismaView', {
        title: "Isma Controller"
    });
};