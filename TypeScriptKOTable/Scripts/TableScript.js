///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/knockout/knockout.d.ts" />
var Student = (function () {
    // constructor
    function Student(Id, FirstName, LastName, Gender, Phone) {
        this.genders = [
            "Male",
            "Female",
            "Other"
        ];
        // Добавление студента
        this.addStudent = function () {
            var dataObject = ko.toJSON(this);
            $.ajax({
                url: '/home/AddStudent',
                type: 'post',
                data: dataObject,
                contentType: 'application/json',
                success: function (data) {
                    alert(dataObject);
                    this.Id = null;
                    this.FirstName = '';
                    this.LastName = '';
                    this.Phone = '';
                },
                error: function () {
                    alert(dataObject);
                }
            });
        };
        this.Id = ko.observable(Id);
        this.FirstName = ko.observable(FirstName);
        this.LastName = ko.observable(LastName);
        this.Gender = ko.observable(Gender);
        this.Phone = ko.observable(Phone);
    }
    return Student;
}());
//class StudentViewModel {
//    public students: KnockoutObservableArray<Student>;
//    constructor() {
//        this.students = ko.observableArray([]);
//    }
//}
var Pagination = (function () {
    function Pagination() {
        this.nextPage = function () {
            if (((this.currentPageIndex() + 1) * this.pageSize()) < this.students().length) {
                this.currentPageIndex(this.currentPageIndex() + 1);
            }
            else {
                this.currentPageIndex(0);
            }
        };
        this.previousPage = function () {
            if (this.currentPageIndex() > 0) {
                this.currentPageIndex(this.currentPageIndex() - 1);
            }
            else {
                this.currentPageIndex((Math.ceil(this.students().length / this.pageSize())) - 1);
            }
        };
        this.currentPage = ko.observableArray([]);
        this.pageSize = ko.observable('5');
        this.currentPageIndex = ko.observable(0);
        this.students = ko.observableArray([]);
    }
    return Pagination;
}());
$(document).ready(function () {
    var serverData;
    serverData = JSON.parse($("#serverJSON").val());
    var ViewModel = {
        Pagination: new Pagination(),
        Student: new Student(null, '', '', '', '')
    };
    var i;
    for (i = 0; i < serverData.length; i++) {
        var serverStudent;
        serverStudent = serverData[i];
        ViewModel.Pagination.students.push(new Student(serverStudent.Id, serverStudent.FirstName, serverStudent.LastName, serverStudent.Gender, serverStudent.Phone));
    }
    ViewModel.Pagination.currentPage = ko.computed(function () {
        var pagesize = parseInt(ViewModel.Pagination.pageSize(), 10), startIndex = pagesize * ViewModel.Pagination.currentPageIndex(), endIndex = startIndex + pagesize;
        return ViewModel.Pagination.students.slice(startIndex, endIndex);
    });
    ko.applyBindings(ViewModel);
});
