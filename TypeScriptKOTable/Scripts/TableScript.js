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
        this.Id = ko.observable(Id);
        this.FirstName = ko.observable(FirstName);
        this.LastName = ko.observable(LastName);
        this.Gender = ko.observable(Gender);
        this.Phone = ko.observable(Phone);
    }
    // Добавление студента
    Student.prototype.addStudent = function () {
        var dataObject = ko.toJSON(this);
        $.ajax({
            url: '/home/AddStudent',
            type: 'post',
            data: dataObject,
            contentType: 'application/json',
            success: function (data) {
                console.log(dataObject);
            },
            error: function () {
                console.log(dataObject);
            }
        });
    };
    ;
    return Student;
}());
//class StudentViewModel {
//    public students: KnockoutObservableArray<Student>;
//    constructor() {
//        this.students = ko.observableArray([]);
//    }
//}
var StudentViewModel = (function () {
    function StudentViewModel() {
        // Смена шаблона редактирования
        this.currentTemplate = function (tmpl) {
            return tmpl === StudentViewModel.editTemplate ? 'editTemplate' : StudentViewModel.readonlyTemplate;
        };
        // Сброс шаблона на обычный
        this.resetTemplate = function (t) {
            StudentViewModel.editTemplate("readonlyTemplate");
        };
        this.currentPage = ko.observableArray([]);
        this.pageSize = ko.observable(5);
        this.currentPageIndex = ko.observable(0);
        this.students = ko.observableArray([]);
        StudentViewModel.sortType = "ascending";
        this.currentColumn = ko.observable("");
        this.iconType = ko.observable("");
        StudentViewModel.readonlyTemplate = ko.observable("readonlyTemplate");
        StudentViewModel.editTemplate = ko.observable("");
    }
    StudentViewModel.prototype.nextPage = function () {
        if (((this.currentPageIndex() + 1) * this.pageSize()) < this.students().length) {
            this.currentPageIndex(this.currentPageIndex() + 1);
        }
        else {
            this.currentPageIndex(0);
        }
    };
    ;
    StudentViewModel.prototype.previousPage = function () {
        if (this.currentPageIndex() > 0) {
            this.currentPageIndex(this.currentPageIndex() - 1);
        }
        else {
            this.currentPageIndex((Math.ceil(this.students().length / this.pageSize())) - 1);
        }
    };
    ;
    // Удаление студента из списка
    StudentViewModel.prototype.removeStudent = function (student) {
        $.ajax({
            url: '/home/DeleteStudent/' + student.Id,
            type: 'post',
            contentType: 'application/json',
            success: function () {
            }
        });
    };
    ;
    // Сортировка
    StudentViewModel.prototype.sortTable = function (students, e) {
        var orderProp = $(e.target).attr("data-column");
        this.currentColumn(orderProp);
        this.students.sort(function (left, right) {
            var leftVal = left[orderProp];
            var rightVal = right[orderProp];
            if (StudentViewModel.sortType == "ascending") {
                return leftVal < rightVal ? 1 : -1;
            }
            else {
                return leftVal > rightVal ? 1 : -1;
            }
        });
        // Смена иконки
        StudentViewModel.sortType = (StudentViewModel.sortType == "ascending") ? "descending" : "ascending";
        this.iconType((StudentViewModel.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
    };
    ;
    return StudentViewModel;
}());
$(document).ready(function () {
    var ViewModel = {
        StudentViewModel: new StudentViewModel(),
        Student: new Student(null, '', '', '', '')
    };
    $.getJSON('/home/GetStudents', function (data) {
        //$.each(data, function (key, value) {
        //    ViewModel.StudentViewModel.students.push(new Student(value.Id, value.FirstName, value.LastName, value.Gender, value.Phone));
        //});
        ViewModel.StudentViewModel.students(data);
    });
    ViewModel.StudentViewModel.currentPage = ko.computed(function () {
        var pagesize = parseInt(ViewModel.StudentViewModel.pageSize().toString(), 10), startIndex = pagesize * ViewModel.StudentViewModel.currentPageIndex(), endIndex = startIndex + pagesize;
        return ViewModel.StudentViewModel.students.slice(startIndex, endIndex);
    });
    ko.applyBindings(ViewModel);
});
