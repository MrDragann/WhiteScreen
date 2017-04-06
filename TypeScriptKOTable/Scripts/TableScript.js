///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/knockout/knockout.d.ts" />
$(document).ready(function () {
    var ViewModel = {
        ModelStudent: new ModelStudent(),
        Paging: new Paging(),
        StudentViewModel: new StudentViewModel(),
        StudentAction: new StudentAction()
    };
    ko.applyBindings(ViewModel);
});
/**
 * Класс модели студента
 */
var ModelStudent = (function () {
    // constructor
    function ModelStudent(Id, FirstName, LastName, Gender, Phone) {
        this.Id = ko.observable(Id);
        this.FirstName = ko.observable(FirstName);
        this.LastName = ko.observable(LastName);
        this.Gender = ko.observable(Gender);
        this.Phone = ko.observable(Phone);
    }
    return ModelStudent;
}());
/**
 * Редактирование данных коллекции
 */
var StudentAction = (function () {
    function StudentAction() {
    }
    /**
     * Добавление студента
     * @param student
     */
    StudentAction.prototype.addStudent = function (student) {
        var dataObject = ko.toJSON(student.ModelStudent);
        $.ajax({
            url: '/home/AddStudent',
            type: 'post',
            data: dataObject,
            contentType: 'application/json',
            success: function (data) {
                console.log(dataObject);
                Paging.Collection.push(data);
            },
            error: function () {
                console.log(dataObject);
            }
        });
    };
    ;
    /**
     * Удаление студента из списка
     * @param student
     */
    StudentAction.prototype.removeStudent = function (student) {
        var stud = student.Id;
        Paging.Collection.remove(student);
        $.ajax({
            url: '/home/DeleteStudent/' + student.Id,
            type: 'post',
            contentType: 'application/json',
            success: function () {
            }
        });
    };
    ;
    StudentAction.prototype.resetTemplate = function () {
        StudentViewModel.resetTemplate();
    };
    /**
     * Редактирование студента
     * @param data
     */
    StudentAction.prototype.saveChanges = function (data) {
        var student = {
            Id: data.Id,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Gender: data.Gender,
            Phone: data.Phone
        };
        $.ajax({
            url: '/home/EditStudent',
            type: 'post',
            data: student,
            success: function (data) {
                StudentViewModel.resetTemplate();
            },
            error: function (err) {
                console.log(err);
            }
        });
    };
    ;
    return StudentAction;
}());
/**
 * Url для загрузки коллекции
 */
var GetCollectionUrl = "/home/GetStudents";
/**
 * Постраничный вывод
 */
var Paging = (function () {
    function Paging() {
        var _this = this;
        Paging.Collection = ko.observableArray([]);
        this.currentPage = ko.observableArray([]);
        this.pageSize = ko.observable(5);
        this.currentPageIndex = ko.observable(0);
        this.getCollection();
        this.currentPage = ko.computed(function () {
            var pagesize = parseInt(_this.pageSize().toString(), 10), startIndex = pagesize * _this.currentPageIndex(), endIndex = startIndex + pagesize;
            return Paging.Collection.slice(startIndex, endIndex);
        });
    }
    /**
     * Загрузка коллекции с сервера
     */
    Paging.prototype.getCollection = function () {
        $.getJSON(GetCollectionUrl, function (data) {
            //$.each(data, function (key, value) {
            //    Paging.Collection.push(new ModelStudent(value.Id, value.FirstName, value.LastName, value.Gender, value.Phone));
            //});
            Paging.Collection(data);
        });
    };
    /**
     * Переход на следующую страницу
     */
    Paging.prototype.nextPage = function () {
        if (((this.currentPageIndex() + 1) * this.pageSize()) < Paging.Collection().length) {
            this.currentPageIndex(this.currentPageIndex() + 1);
        }
        else {
            this.currentPageIndex(0);
        }
    };
    ;
    /**
     * Переход на страницу назад
     */
    Paging.prototype.previousPage = function () {
        if (this.currentPageIndex() > 0) {
            this.currentPageIndex(this.currentPageIndex() - 1);
        }
        else {
            this.currentPageIndex((Math.ceil(Paging.Collection().length / this.pageSize())) - 1);
        }
    };
    ;
    return Paging;
}());
/**
 * Сортировка коллекции
 */
var StudentViewModel = (function () {
    function StudentViewModel() {
        var _this = this;
        StudentViewModel.sortType = "ascending";
        this.currentColumn = ko.observable("");
        this.iconType = ko.observable("");
        this.readonlyTemplate = ko.observable("readonlyTemplate");
        this.editTemplate = ko.observable();
        // Смена шаблона редактирования
        this.currentTemplate = function (tmpl) {
            return tmpl === _this.editTemplate() ? 'editTemplate' : _this.readonlyTemplate();
        };
        // Сброс шаблона на обычный
        StudentViewModel.resetTemplate = function (t) {
            _this.editTemplate("readonlyTemplate");
        };
    }
    /**
     * Сортировка
     * @param students
     * @param e
     */
    StudentViewModel.prototype.sortTable = function (students, e) {
        var orderProp = $(e.target).attr("data-column");
        this.currentColumn(orderProp);
        Paging.Collection.sort(function (left, right) {
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
