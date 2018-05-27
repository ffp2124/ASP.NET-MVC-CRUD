using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExerciseRecord.DAL
{
    public interface IExerciseRepository : IDisposable
    {
        IQueryable<Model.ExerciseRecord> GetExerciseRecords();
        Model.ExerciseRecord GetExerciseRecordById(int id);
        void InsertExercise(Model.ExerciseRecord exercise);
        void DeleteExercise(int id);
        void UpdateExercise(Model.ExerciseRecord exercise);
        void Save();
    }
}