define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var ViewModel;
    (function (ViewModel) {
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
        ViewModel.Paging = Paging;
        var SortCollection = (function () {
            function SortCollection() {
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
            SortCollection.prototype.sortTable = function (collection, e) {
                var orderProp = $(e.target).attr("data-column");
                if (orderProp == undefined)
                    var orderPro = $(e.target).parent();
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
            ;
            return SortCollection;
        }());
        ViewModel.SortCollection = SortCollection;
    })(ViewModel || (ViewModel = {}));
    /**
     * Url для загрузки коллекции
     */
    var GetCollectionUrl = "/home/GetStudents";
    return ViewModel;
});
//# sourceMappingURL=paging-table.js.map