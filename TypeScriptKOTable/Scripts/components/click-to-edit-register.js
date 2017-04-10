define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    // register the component
    ko.components.register("click-to-edit", {
        viewModel: { require: "components/click-to-edit" },
        template: { require: "text!components/click-to-edit.html" }
    });
});
//# sourceMappingURL=click-to-edit-register.js.map