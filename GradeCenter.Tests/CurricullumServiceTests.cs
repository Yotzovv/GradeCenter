﻿using GradeCenter.Data.Models;
using GradeCenter.Data;
using GradeCenter.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using GradeCenter.Data.Models.Account;

namespace GradeCenter.Tests
{
    public class CurricullumServiceTests
    {
        private readonly Mock<GradeCenterContext> _mockContext;
        private readonly CurriculumService _curriculumService;
        private readonly List<Discipline> _disciplines;

        public CurricullumServiceTests()
        {
            // Arrange
            var teacher1 = new AspNetUser { Id = Guid.NewGuid(), UserName = "Teacher1" };
            var teacher2 = new AspNetUser { Id = Guid.NewGuid(), UserName = "Teacher2" };

            var student1 = new AspNetUser { Id = Guid.NewGuid(), UserName = "Student1" };
            var student2 = new AspNetUser { Id = Guid.NewGuid(), UserName = "Student2" };

            var schoolClass = new SchoolClass { Id = Guid.NewGuid(), Year = 2023 };
            schoolClass.Students = new List<AspNetUser> { student1, student2 };

            _disciplines = new List<Discipline>
            {
                new Discipline { Id = Guid.NewGuid(), Name = "Math", IsActive = true, Teacher = teacher1, SchoolClass = schoolClass },
                new Discipline { Id = Guid.NewGuid(), Name = "English", IsActive = true, Teacher = teacher2, SchoolClass = schoolClass }
            };

            var mockSet = new Mock<DbSet<Discipline>>();
            mockSet.As<IQueryable<Discipline>>().Setup(m => m.Provider).Returns(_disciplines.AsQueryable().Provider);
            mockSet.As<IQueryable<Discipline>>().Setup(m => m.Expression).Returns(_disciplines.AsQueryable().Expression);
            mockSet.As<IQueryable<Discipline>>().Setup(m => m.ElementType).Returns(_disciplines.AsQueryable().ElementType);
            mockSet.As<IQueryable<Discipline>>().Setup(m => m.GetEnumerator()).Returns(_disciplines.AsQueryable().GetEnumerator());

            _mockContext = new Mock<GradeCenterContext>();
            _mockContext.Setup(c => c.Disciplines).Returns(mockSet.Object);

            _curriculumService = new CurriculumService(_mockContext.Object);
        }

        [Fact]
        public void Create_Should_AddDisciplinesToDatabase()
        {
            // Act
            _curriculumService.Create(_disciplines);

            // Assert
            _mockContext.Verify(m => m.Disciplines.AddRange(It.Is<List<Discipline>>(d => d.Count == 2)), Times.Once);
            _mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }

        [Fact]
        public void Update_Should_UpdateDisciplinesInDatabase()
        {
            //Arrange
            _disciplines[0].OccuranceDay = DayOfWeek.Tuesday;
            _disciplines[0].OccuranceTime = TimeSpan.Parse("10:00:00");

            _disciplines[1].OccuranceDay = DayOfWeek.Friday;
            _disciplines[1].OccuranceTime = TimeSpan.Parse("11:00:00");

            // Act
            _curriculumService.Update(_disciplines);

            // Assert
            _mockContext.Verify(m => m.SaveChanges(), Times.AtLeast(2));
            _disciplines.ForEach(d => Assert.False(d.OccuranceDay == DayOfWeek.Sunday));
        }

        [Fact]
        public void Delete_Should_InactivateDisciplinesInDatabase()
        {
            // Act
            _curriculumService.Delete(_disciplines);

            // Assert
            _disciplines.ForEach(d => Assert.False(d.IsActive));
            _mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }

        [Fact]
        public void GetClassesForDay_Should_ReturnClassesForSpecificDay()
        {
            // Arrange
            Guid schoolClassId = _disciplines[0].SchoolClass.Id; // use school class Id from our setup data
            DayOfWeek day = _disciplines[0].OccuranceDay; // use day from our setup data

            // Act
            var classesForDay = _curriculumService.GetClassesForDay(schoolClassId, day);

            // Assert
            Assert.NotEmpty(classesForDay);
            Assert.All(classesForDay, c => Assert.True(c.SchoolClass.Id == schoolClassId && c.OccuranceDay == day && c.IsActive));
        }

        [Fact]
        public void GetLoggedUserClasses_Should_ReturnClassesForSpecificUser()
        {
            // Arrange
            Guid userId = _disciplines[0].SchoolClass.Students[0].Id; // use student Id from our setup data

            // Act
            var userClasses = _curriculumService.GetLoggedUserClasses(userId);

            // Assert
            Assert.NotEmpty(userClasses);
            Assert.All(userClasses, c => Assert.True(c.SchoolClass.Students.Any(s => s.Id == userId) && c.IsActive));
        }

    }
}
