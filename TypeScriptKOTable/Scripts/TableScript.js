///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/knockout/knockout.d.ts" />
var Student = (function () {
    // constructor
    function Student(Id, FirstName, LastName, Gender, Phone) {
        this.Id = ko.observable(Id);
        this.FirstName = ko.observable(FirstName);
        this.LastName = ko.observable(LastName);
        this.Gender = ko.observable(Gender);
        this.Phone = ko.observable(Phone);
    }
    return Student;
}());
var StudentViewModel = (function () {
    function StudentViewModel() {
        this.students = ko.observableArray([]);
    }
    return StudentViewModel;
}());
$(document).ready(function () {
    var serverData;
    serverData = JSON.parse($("#serverJSON").val());
    var ViewModel = {
        StudentViewModel: new StudentViewModel()
    };
    //var vm: StudentViewModel;
    //vm = new StudentViewModel();
    var i;
    for (i = 0; i < serverData.length; i++) {
        var serverStudent;
        serverStudent = serverData[i];
        ViewModel.StudentViewModel.students.push(new Student(serverStudent.Id, serverStudent.FirstName, serverStudent.LastName, serverStudent.Gender, serverStudent.Phone));
    }
    ko.applyBindings(ViewModel);
});
//# sourceMappingURL=TableScript.js.map