var adq = adq || {};
            
adq.module = function () {

    var modules = {};

    return function (name) {

        if (modules[name]) {
            return modules[name];
        }

        return modules[name] = {};
    };

}();