define(["require", "exports", "knockout", 'components/Paging-table/paging-table'], function (require, exports, ko, ViewModel) {
    "use strict";
    // register the component
    ko.components.register("paging-table", {
        viewModel: ViewModel.Paging,
        template: { require: "text!components/Paging-table/paging-table.html" }
    });
});
//# sourceMappingURL=paging-table-register.js.map