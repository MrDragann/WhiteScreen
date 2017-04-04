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
    genders = [
        "Male",
        "Female",
        "Other"
    ];
    // Добавление студента
    addStudent = function () {
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
}

//class StudentViewModel {
//    public students: KnockoutObservableArray<Student>;
//    constructor() {
//        this.students = ko.observableArray([]);
//    }
//}

class Pagination {
    public students: KnockoutObservableArray<Student>;
    currentPage: any;
    pageSize: KnockoutObservable<string>;
    currentPageIndex: KnockoutObservable<number>;

    nextPage = function () {
        if (((this.currentPageIndex() + 1) * this.pageSize()) < this.students().length) {
            this.currentPageIndex(this.currentPageIndex() + 1);
        }
        else {
            this.currentPageIndex(0);
        }
    };
    previousPage = function () {
        if (this.currentPageIndex() > 0) {
            this.currentPageIndex(this.currentPageIndex() - 1);
        }
        else {
            this.currentPageIndex((Math.ceil(this.students().length / this.pageSize())) - 1);
        }
    };

    constructor() {
        this.currentPage = ko.observableArray([]);
        this.pageSize = ko.observable('5');
        this.currentPageIndex = ko.observable(0);
        this.students = ko.observableArray([]);
    }
}

$(document).ready(function () {
    var serverData: any[];
    serverData = JSON.parse($("#serverJSON").val());
    var ViewModel = {
        Pagination: new Pagination(),
        Student: new Student(null,'','','','')
    };
    
    var i: number;
    for (i = 0; i < serverData.length; i++) {
        var serverStudent: any;
        serverStudent = serverData[i];
        ViewModel.Pagination.students.push(new Student(serverStudent.Id, serverStudent.FirstName, serverStudent.LastName, serverStudent.Gender, serverStudent.Phone));
    }

    ViewModel.Pagination.currentPage = ko.computed(function () {
        var pagesize = parseInt(ViewModel.Pagination.pageSize(),10),
            startIndex = pagesize * ViewModel.Pagination.currentPageIndex(),
            endIndex = startIndex + pagesize;
        return ViewModel.Pagination.students.slice(startIndex, endIndex);
    });
    ko.applyBindings(ViewModel);
});
