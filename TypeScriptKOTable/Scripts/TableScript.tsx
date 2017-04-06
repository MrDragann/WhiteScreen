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
    /**
     * Добавление студента
     * @param student
     */
    addStudent(student: any): void {
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

    /**
     * Удаление студента из списка
     * @param student
     */
    removeStudent(student: ModelStudent): void {
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
    resetTemplate(): void {
        StudentViewModel.resetTemplate();
    }
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
}
/**
 * Url для загрузки коллекции
 */
const GetCollectionUrl = "/home/GetStudents";

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
 * Сортировка коллекции
 */
class StudentViewModel {
    static sortType: string;
    currentColumn: KnockoutObservable<string>;
    iconType: KnockoutObservable<string>;

    readonlyTemplate: KnockoutObservable<any>;
    editTemplate: KnockoutObservable<any>;
    currentTemplate: any;
    static resetTemplate: any;

    constructor() {
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
    sortTable(students: KnockoutObservableArray<ModelStudent>, e): void {
        var orderProp = $(e.target).attr("data-column")
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
}