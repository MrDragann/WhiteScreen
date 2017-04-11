define(["require", "exports", "knockout", 'components/click-to-edit'], function (require, exports, ko, ViewModel) {
    "use strict";
    // register the component
    ko.components.register("click-to-edit", {
        viewModel: ViewModel.ClickToEditViewModel,
        template: { require: "text!components/click-to-edit.html" }
    });
});
//# sourceMappingURL=click-to-edit-register.js.map