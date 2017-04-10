define(['knockout', 'text!../Views/Home/_RegisterStudent.cshtml'], function (ko, addStudentTemplate) {
    function addStudent(params) {
        self = this;
        self.viewModel = params.$root;
        self.ModelStudent = self.viewModel.ModelStudent;
        return self;
    }
    return { viewModel: addStudent, template: addStudentTemplate };
});