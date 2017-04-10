define(['jquery', 'knockout'], function ($, ko) {
    ko.components.register('add-student', {
        require: 'Scripts/add-student'
    });
    ko.applyBindings();
});