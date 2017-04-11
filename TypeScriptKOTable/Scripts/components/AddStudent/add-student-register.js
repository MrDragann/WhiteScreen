define(["require", "exports", "knockout", 'components/AddStudent/add-student'], function (require, exports, ko, ViewModel) {
    "use strict";
    // register the component
    ko.components.register("add-student", {
        viewModel: ViewModel.AddStudent,
        template: { require: "text!components/AddStudent/add-student.html" }
    });
});
//# sourceMappingURL=add-student-register.js.map