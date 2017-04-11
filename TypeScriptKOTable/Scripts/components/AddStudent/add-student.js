define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var ViewModel;
    (function (ViewModel) {
        var AddStudent = (function () {
            // constructor
            function AddStudent(Id, FirstName, LastName, Gender, Phone) {
                this.Id = ko.observable(Id);
                this.FirstName = ko.observable(FirstName);
                this.LastName = ko.observable(LastName);
                this.Gender = ko.observable(Gender);
                this.Phone = ko.observable(Phone);
            }
            /**
     * Добавление студента
     * @param student
     */
            AddStudent.prototype.addStudent = function (student) {
                var dataObject = ko.toJSON(student);
                $.ajax({
                    url: AddStudentUrl,
                    type: 'post',
                    data: dataObject,
                    contentType: 'application/json',
                    success: function (data) {
                        console.log(dataObject);
                        //Paging.Collection.push(data);
                    },
                    error: function () {
                        console.log(dataObject);
                    }
                });
            };
            ;
            return AddStudent;
        }());
        ViewModel.AddStudent = AddStudent;
    })(ViewModel || (ViewModel = {}));
    // return the 'class' which is the constructor function
    //return ClickToEditViewModel;
    /**
     * Url добавления студента
     */
    var AddStudentUrl = "/home/AddStudent";
    return ViewModel;
});
//# sourceMappingURL=add-student.js.map