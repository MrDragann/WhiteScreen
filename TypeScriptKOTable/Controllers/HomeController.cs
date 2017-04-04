using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TypeScriptKOTable.Models;

namespace TypeScriptKOTable.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var students = StudentRepository.GetStudents();
            return View(students);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult GetStudents()
        {
            var jsondata = StudentRepository.GetStudents();
            return Json(jsondata, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AddStudent(Student student)
        {
            StudentRepository.InsertStudent(student);
            return Json(student, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult EditStudent(Student student)
        {
            StudentRepository.EditStudent(student);
            return Json("Сохранено");
        }
        [HttpPost]
        public ActionResult DeleteStudent(int Id)
        {
            StudentRepository.DeleteStudent(Id);
            return Json("Удален");
        }
    }
}