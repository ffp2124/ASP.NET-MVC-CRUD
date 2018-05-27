using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Model;

namespace ExerciseRecord.DAL
{
    public class ExerciseRepository : IExerciseRepository, IDisposable
    {
        private ExerciseEntities context;
        
        public ExerciseRepository(ExerciseEntities exercise)
        {
            this.context = exercise;
        }

        public IQueryable<Model.ExerciseRecord> GetExerciseRecords()
        {
            return context.ExerciseRecords;
        }

        public Model.ExerciseRecord GetExerciseRecordById(int id)
        {
            return context.ExerciseRecords.Find(id);
        }

        public void InsertExercise(Model.ExerciseRecord exercise)
        {
            context.ExerciseRecords.Add(exercise);
        }

        public void DeleteExercise(int id)
        {
            Model.ExerciseRecord exercise = context.ExerciseRecords.Find(id);
            context.ExerciseRecords.Remove(exercise);
        }

        public void UpdateExercise(Model.ExerciseRecord exercise)
        {
            context.Entry(exercise).State = System.Data.Entity.EntityState.Modified;
        }

        public void Save()
        {
            context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}