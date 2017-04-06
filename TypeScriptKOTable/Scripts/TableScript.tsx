///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/knockout/knockout.d.ts" />

$(document).ready(function () {
    var viewModel = new TableModel();
    ko.applyBindings(viewModel);
});

class TableModel {
    ModelStudent = new ModelStudent();
    Paging = new Paging();
    SortCollection = new SortCollection();
    StudentAction = new StudentAction();
}
/**
 * Url для загрузки коллекции
 */
const GetCollectionUrl = "/home/GetStudents";
/**
 * Url добавления студента
 */
const AddStudentUrl = "/home/AddStudent";
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

    /**
     * Добавление студента
     * @param student
     */
    addStudent(student: any): void {
        var dataObject = ko.toJSON(student.ModelStudent);

        $.ajax({
            url: AddStudentUrl,
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

    /**
     * Удаление студента из списка
     * @param student
     */
    removeStudent(student: ModelStudent): void {
        var stud = student.Id;
        Paging.Collection.remove(student);
        $.ajax({
            url: DeleteStudentUrl + student.Id,
            type: 'post',
            contentType: 'application/json',
            success: function () { 
            }
        });
    };
    /**
     * Редактирование студента
     * @param data
     */
    saveChanges(data):void {
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
 * Сортировка коллекцииStudentViewModel
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
     * @param students
     * @param e
     */
    sortTable(students: KnockoutObservableArray<ModelStudent>, e): void {
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
ko.components.register('AddStudent', {
    viewModel: function (params) {
        this.FirstName = params.ModelStudent.FirstName();
        this.LastName = params.ModelStudent.LastName();
        this.Gender = params.ModelStudent.Gender();
        this.Phone = params.ModelStudent.Phone();
    },
    template: '<div class="form-group">'
        +'<label for="inpFirstName">Имя</label>'
        +'<input id="inpFirstName" type="text" class="form-control" data-bind="value: FirstName" />'
    +'</div>'
    +'<div class="form-group">'
        +'<label for="inpLastName">Фамилия</label>'
        +'<input id="inpLastName" type="text" class="form-control" data-bind="value: LastName" />'
    +'</div>'
    +'<div class="form-group">'
        +'<label for="inpGender">Пол</label>'
        +'<select id="inpGender" class="form-control" data-bind="value: Gender">'
            +'<option value="Male">Мужчина</option>'
            +'<option value="Female">Женщина</option>'
            +'<option value="Other">Другой</option>'
        +'</select>'
    +'</div>'
    +'<div class="form-group">'
        +'<label for="txtPhone">Телефон</label>'
        +'<input id="txtPhone" class="form-control" data-bind="value: Phone" />'
    +'</div>'
});
ko.components.register('message-editor', {
    viewModel: function(params) {
        this.text = ko.observable(params && params.initialText || '');
    },
    template: '<input data-bind="value: text" /> '
            + '<span data-bind="text: text().length"></span>'
});