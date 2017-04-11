import ko = require("knockout");

import ViewModel = require('components/click-to-edit');
// register the component
ko.components.register("click-to-edit", {
    viewModel: ViewModel.ClickToEditViewModel,
    template: { require: "text!components/click-to-edit.html" }
});