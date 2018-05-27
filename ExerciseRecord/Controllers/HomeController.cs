using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ExerciseRecord.Helper;
using Model;
using Newtonsoft.Json;
using ExerciseRecord.DAL;

namespace ExerciseRecord.Controllers
{
    public class HomeController : Controller
    {
        private IExerciseRepository exerciseRepository;

        public HomeController()
        {
            this.exerciseRepository = new ExerciseRepository(new ExerciseEntities());
        }

        public ActionResult Index()
        {
            return View();
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

        public JsonResult GetExerciseList()
        {
            var exercises = exerciseRepository.GetExerciseRecords();
            exercises = exercises.OrderByDescending(x => x.ExerciseDate);
            return Json(exercises, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetExerciseById(int id)
        {
            Model.ExerciseRecord exercise = exerciseRepository.GetExerciseRecordById(id);
            string value = string.Empty;
            value = JsonConvert.SerializeObject(exercise, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveExercise(Model.ExerciseRecord exercise)
        {
            var result = true;
            var compare = exerciseRepository.GetExerciseRecords();
            var compareName = from s in compare
                              where s.ExerciseName == exercise.ExerciseName && s.ExerciseDate == exercise.ExerciseDate
                              select s;

            try
            {
                if (ModelState.IsValid)
                {
                    if (exercise.Id > 0)
                    {
                        Model.ExerciseRecord er = exerciseRepository.GetExerciseRecordById(exercise.Id);
                        er.ExerciseName = exercise.ExerciseName;
                        er.ExerciseDate = exercise.ExerciseDate;
                        er.DurationInMinutes = exercise.DurationInMinutes;
                        exerciseRepository.Save();
                        result = true;
                    }
                    else
                    {
                        if (!compareName.Any())
                        {
                            Model.ExerciseRecord exer = new Model.ExerciseRecord();
                            exer.ExerciseName = exercise.ExerciseName;
                            exer.ExerciseDate = exercise.ExerciseDate;
                            exer.DurationInMinutes = exercise.DurationInMinutes;
                            exerciseRepository.InsertExercise(exer);
                            exerciseRepository.Save();
                            result = true;
                        }
                        else
                        {
                            result = false;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            return Json(result);
        }

        public JsonResult GetSearchingData(string searchValue)
        {
            var exerciseLists = exerciseRepository.GetExerciseRecords();
            exerciseLists = exerciseLists.Where(x => x.ExerciseName.Contains(searchValue) || searchValue == null);
            return Json(exerciseLists, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteExerciseRecord(int id)
        {
            bool result = false;
            var deleteExer = exerciseRepository.GetExerciseRecordById(id);
            if (deleteExer != null)
            {
                exerciseRepository.DeleteExercise(id);
                exerciseRepository.Save();
                result = true;
            }

            return Json(result);
        }

        public JsonResult GetPaggedData(int pageNumber = 1, int pageSize = 10)
        {
            List<Model.ExerciseRecord> listData = exerciseRepository.GetExerciseRecords().ToList();
            listData = listData.OrderByDescending(x => x.ExerciseDate).ToList();
            var pagedData = Pagination.PagedResult(listData, pageNumber, pageSize);
            return Json(pagedData, JsonRequestBehavior.AllowGet);
        }
        
    }
}