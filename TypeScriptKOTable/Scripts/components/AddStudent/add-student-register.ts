import ko = require("knockout");

import ViewModel = require('components/AddStudent/add-student');
// register the component
ko.components.register("add-student", {
    viewModel: ViewModel.AddStudent,
    template: { require: "text!components/AddStudent/add-student.html" }
});