///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/knockout/knockout.d.ts" />

$(document).ready(function () {
    var viewModel = {
        Paging: new Paging(),
        SortCollection: new SortCollection(),
        StudentAction: new StudentAction()
    };
    ko.applyBindings(viewModel);
});
import AddStudent = require("components/AddStudent/add-student-register");

var addStudent = AddStudent;

export class TableModel {
    //ModelStudent = new ModelStudent();
    Paging = new Paging();
    SortCollection = new SortCollection();
    StudentAction = new StudentAction();
}
/**
 * Url для загрузки коллекции
 */
const GetCollectionUrl = "/home/GetStudents";
/**
 * Url удаления студента
 */
const DeleteStudentUrl = "/home/DeleteStudent/";
/**
 * Url редактирования студента
 */
const EditStudentUrl = "/home/EditStudent";
/**
 * Класс модели студента
 */
class ModelStudent {
    Id: KnockoutObservable<number>;
    FirstName: KnockoutObservable<string>;
    LastName: KnockoutObservable<string>;
    Gender: KnockoutObservable<string>;
    Phone: KnockoutObservable<string>;
    // constructor
    constructor(Id?: number, FirstName?: string, LastName?: string, Gender?: string, Phone?: string) {
        this.Id = ko.observable(Id);
        this.FirstName = ko.observable(FirstName);
        this.LastName = ko.observable(LastName);
        this.Gender = ko.observable(Gender);
        this.Phone = ko.observable(Phone);
    }
}
/**
 * Редактирование данных коллекции
 */
class StudentAction {
    readonlyTemplate: KnockoutObservable<any>;
    editTemplate: KnockoutObservable<any>;
    currentTemplate: any;
    static resetTemplate: any;

    currentData: any;

    constructor() {
        var _this = this;
        this.readonlyTemplate = ko.observable("readonlyTemplate");
        this.editTemplate = ko.observable();
        // Смена шаблона редактирования
        this.currentTemplate = function (tmpl) {
            _this.currentData = tmpl;
            return tmpl === _this.editTemplate() ? 'editTemplate' : _this.readonlyTemplate();
        };
        // Сброс шаблона на обычный
        StudentAction.resetTemplate = function (t) {
            _this.editTemplate("readonlyTemplate");
        };
    }

    ///**
    // * Добавление студента
    // * @param student
    // */
    //addStudent(student: any): void {
    //    var dataObject = ko.toJSON(student.ModelStudent);

    //    $.ajax({
    //        url: AddStudentUrl,
    //        type: 'post',
    //        data: dataObject,
    //        contentType: 'application/json',
    //        success: function (data) {
    //            console.log(dataObject);
    //            Paging.Collection.push(data);
    //        },
    //        error: function () {
    //            console.log(dataObject);
    //        }
    //    });
    //};

    /**
     * Удаление студента из списка
     * @param student
     */
    removeStudent(student: any): void {
        Paging.Collection.remove(student);
        //$.ajax({
        //    url: DeleteStudentUrl + student.Id,
        //    type: 'post',
        //    contentType: 'application/json',
        //    success: function () {
        //    }
        //});
    };
    /**
     * Редактирование студента
     * @param data
     */
    saveChanges(data): void {
        var student = {
            Id: data.Id,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Gender: data.Gender,
            Phone: data.Phone
        };

        $.ajax({
            url: EditStudentUrl,
            type: 'post',
            data: student,
            success: function (data) {
                StudentAction.resetTemplate();
            },
            error: function (err) {
                console.log(err);
            }
        });
    };
    /**
     * Сброс шаблона
     */
    resetTemplate(): void {

        StudentAction.resetTemplate();
    }
}

/**
 * Постраничный вывод
 */
class Paging {
    public static Collection: KnockoutObservableArray<any>;

    currentPage: KnockoutObservable<any>;
    pageSize: KnockoutObservable<number>;
    currentPageIndex: KnockoutObservable<number>;

    constructor() {
        var _this = this;
        Paging.Collection = ko.observableArray([]);
        this.currentPage = ko.observableArray([]);
        this.pageSize = ko.observable(5);
        this.currentPageIndex = ko.observable(0);
        this.getCollection();
        this.currentPage = ko.computed(function () {
            var pagesize = parseInt(_this.pageSize().toString(), 10),
                startIndex = pagesize * _this.currentPageIndex(),
                endIndex = startIndex + pagesize;
            return Paging.Collection.slice(startIndex, endIndex);
        });
    }
    /**
     * Загрузка коллекции с сервера
     */
    getCollection(): void {
        $.getJSON(GetCollectionUrl, function (data) {
            //$.each(data, function (key, value) {
            //    Paging.Collection.push(new ModelStudent(value.Id, value.FirstName, value.LastName, value.Gender, value.Phone));
            //});
            Paging.Collection(data);
        });
    }

    /**
     * Переход на следующую страницу
     */
    nextPage(): void {
        if (((this.currentPageIndex() + 1) * this.pageSize()) < Paging.Collection().length) {
            this.currentPageIndex(this.currentPageIndex() + 1);
        }
        else {
            this.currentPageIndex(0);
        }
    };
    /**
     * Переход на страницу назад
     */
    previousPage(): void {
        if (this.currentPageIndex() > 0) {
            this.currentPageIndex(this.currentPageIndex() - 1);
        }
        else {
            this.currentPageIndex((Math.ceil(Paging.Collection().length / this.pageSize())) - 1);
        }
    };
}
/**
 * Сортировка столбца таблицы
 */
class SortCollection {
    static sortType: string;
    currentColumn: KnockoutObservable<string>;
    iconType: KnockoutObservable<string>;

    constructor() {
        var _this = this;
        SortCollection.sortType = "ascending";
        this.currentColumn = ko.observable("");
        this.iconType = ko.observable("");
    }
    /**
     * Сортировка
     * @param collection
     * @param e
     */
    sortTable(collection: KnockoutObservableArray<any>, e): void {
        var orderProp = $(e.target).attr("data-column");
        if (orderProp == undefined) var orderPro = $(e.target).parent();
        this.currentColumn(orderProp);
        Paging.Collection.sort(function (left, right) {
            var leftVal = left[orderProp];
            var rightVal = right[orderProp];
            if (SortCollection.sortType == "ascending") {
                return leftVal < rightVal ? 1 : -1;
            }
            else {
                return leftVal > rightVal ? 1 : -1;
            }
        });

        // Смена иконки
        SortCollection.sortType = (SortCollection.sortType == "ascending") ? "descending" : "ascending";
        this.iconType((SortCollection.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
    };
}
//ko.components.register('AddStudent', {
//    viewModel: function (params) {
//        this.viewModel = params.$root;
//        this.ModelStudent = this.viewModel.ModelStudent;
//    },
//    template: '<form role="form" data-bind="with: ModelStudent">'
//    + '<div class="form-group">'
//    + '<label for="inpFirstName">Имя</label>'
//    + '<input id="inpFirstName" type="text" class="form-control" data-bind="value: FirstName" />'
//    + '</div>'
//    + '<div class="form-group">'
//    + '<label for="inpLastName">Фамилия</label>'
//    + '<input id="inpLastName" type="text" class="form-control" data-bind="value: LastName" />'
//    + '</div>'
//    + '<div class="form-group">'
//    + '<label for="inpGender">Пол</label>'
//    + '<select id="inpGender" class="form-control" data-bind="value: Gender">'
//    + '<option value="Male">Мужчина</option>'
//    + '<option value="Female">Женщина</option>'
//    + '<option value="Other">Другой</option>'
//    + '</select>'
//    + '</div>'
//    + '<div class="form-group">'
//    + '<label for="txtPhone">Телефон</label>'
//    + '<input id="txtPhone" class="form-control" data-bind="value: Phone" />'
//    + '</div>'
//    + '</form>'
//    + '<input type="button" id="btnAddStudent" class="btn btn-primary" value="Добавить" data-bind="click: $root.StudentAction.addStudent" />'
//});

ko.components.register('Table', {
    viewModel: function (params) {
        this.viewModel = params.$root;
        this.SortCollection = this.viewModel.SortCollection;
    },
    template: '<thead data-bind="with: SortCollection">'
    + '<tr data-bind="click: sortTable">'
    + '<th data-column="Id">ID'
    + '<span data-bind="attr: { class: currentColumn() == "Id" ? "isVisible" : "isHidden" }">'
    + '<i data-bind="attr: { class: iconType }"></i></span></th>'
    + '<th data-column="FirstName">Имя'
    + '<span data-bind="attr: { class: currentColumn() == "FirstName" ? "isVisible" : "isHidden" }">'
    + '<i data-bind="attr: { class: iconType }"></i></span></th>'
    + '<th data-column="LastName">Фамилия'
    + '<span data-bind="attr: { class: currentColumn() == "LastName" ? "isVisible" : "isHidden" }">'
    + '<i data-bind="attr: { class: iconType }"></i></span></th>'
    + '<th data-column="Gender">Пол'
    + '<span data-bind="attr: { class: currentColumn() == "Gender" ? "isVisible" : "isHidden" }">'
    + '<i data-bind="attr: { class: iconType }"></i></span></th>'
    + '<th data-column="Phone">Телефон'
    + '<span data-bind="attr: { class: currentColumn() == "Phone" ? "isVisible" : "isHidden" }">'
    + '<i data-bind="attr: { class: iconType }"></i></span></th>'
    + '<th></th><th></th></tr></thead>'
    + '<tbody data-bind="template: { name: $root.StudentAction.currentTemplate, foreach: $root.Paging.currentPage }"></tbody>'
});

ko.components.register('Paging', {
    viewModel: function (params) {
        this.viewModel = params.$root;
        this.Paging = this.viewModel.Paging;
    },
    template: '<div data-bind="with: Paging">'
    + '<span style="padding-left:15px;">Отобразить на странице: </span>'
    + '<select id="pageSizeSelector" data-bind="value: pageSize">'
    + '<option value="5">5</option>'
    + '<option value="10">10</option>'
    + '<option value="15">15</option>'
    + '<option value="20">20</option>'
    + '<option value="25">25</option>'
    + '<option value="30">30</option></select>'
    + '<span style="padding-left:20px;">'
    + '<button data-bind="click: previousPage($data)" class="btn btn-sm"><i class="glyphicon glyphicon-step-backward"></i></button>'
    + '&nbsp;Страница&nbsp;<label data-bind="text: currentPageIndex() + 1" class="badge"></label>&nbsp;'
    + '<button data-bind="click: nextPage($data)" class="btn btn-sm"><i class="glyphicon glyphicon-step-forward"></i></button></span></div>'
});
ko.components.register('message-editor', {
    viewModel: function (params) {
        this.text = ko.observable(params && params.initialText || '');
    },
    template: '<input data-bind="value: text" /> '
    + '<span data-bind="text: text().length"></span>'
});