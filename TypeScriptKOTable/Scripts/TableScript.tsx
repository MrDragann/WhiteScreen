///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/knockout/knockout.d.ts" />

class Student {
    Id: KnockoutObservable<number>;
    FirstName: KnockoutObservable<string>;
    LastName: KnockoutObservable<string>;
    Gender: KnockoutObservable<string>;
    Phone: KnockoutObservable<string>;
    // constructor
    constructor(Id: number, FirstName: string, LastName: string, Gender: string, Phone: string) {
        this.Id = ko.observable(Id);
        this.FirstName = ko.observable(FirstName);
        this.LastName = ko.observable(LastName);
        this.Gender = ko.observable(Gender);
        this.Phone = ko.observable(Phone);
    }
}

class StudentViewModel {
    public students: KnockoutObservableArray<Student>;
    constructor() {
        this.students = ko.observableArray([]);
    }
}

$(document).ready(function () {
    var serverData: any[];
    serverData = JSON.parse($("#serverJSON").val());
    var ViewModel = {
        StudentViewModel: new StudentViewModel()
    };
    //var vm: StudentViewModel;
    //vm = new StudentViewModel();
    var i: number;

    for (i = 0; i < serverData.length; i++) {
        var serverStudent: any;
        serverStudent = serverData[i];
        ViewModel.StudentViewModel.students.push(new Student(serverStudent.Id, serverStudent.FirstName, serverStudent.LastName, serverStudent.Gender, serverStudent.Phone));
    }
    ko.applyBindings(ViewModel);
});
