import ko = require("knockout");

import ViewModel = require('components/Paging-table/paging-table');
// register the component
ko.components.register("paging-table", {
    viewModel: ViewModel.Paging,
    template: { require: "text!components/Paging-table/paging-table.html" }
});