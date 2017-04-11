/*
    click-to-edit component viewmodel file
    loaded for the click-to-edit viewmodel
 */
import ko = require("knockout");
module ViewModel {
    export interface clickToEditParams {
        value: KnockoutObservable<string>;
    }

    export class AddStudent {
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
                    //Paging.Collection.push(data);
                },
                error: function () {
                    console.log(dataObject);
                }
            });
        };

    }

}
export = ViewModel;
// return the 'class' which is the constructor function
//return ClickToEditViewModel;
/**
 * Url добавления студента
 */
const AddStudentUrl = "/home/AddStudent";