//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class ExerciseRecord
    {
        public int Id { get; set; }
        [Required(ErrorMessage ="Please enter name")]
        [StringLength(100, ErrorMessage ="name can not longer than 100 characters")]
        public string ExerciseName { get; set; }
        [Required(ErrorMessage ="Please select a date")]
        [DataType(DataType.Date)]
        public System.DateTime ExerciseDate { get; set; }
        [Required(ErrorMessage ="Please enter duration in minutes")]
        [Range(1,120,ErrorMessage ="The duration should between 1 and 120 minutes")]
        public int DurationInMinutes { get; set; }
    }
}
