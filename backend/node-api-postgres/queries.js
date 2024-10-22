const { json, response } = require('express')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: '',
  password: '',
  port: ,
})

const getTeachers = (req, res) => {
  const query = `SELECT * FROM public.teacher`
  pool.query(query, (error, results) => {
    if(error) {
      return res.status(500).json({ message: 'Error during getTeachers', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getSchools = (req, res) => {
    pool.query('SELECT * FROM school', (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error during getSchools', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const login = (req, res) => {
    const query = 'select * from teacher where username = $1 and password = $2'
    const values = [req.body.username, req.body.password]
    pool.query(query, values, (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error during login', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const getAllSchools = (req, res) => {
    // console.log(req.body.id)
    const query = 'select distinct sc.id, sc.name, sc.address, sc.city from teaches te join subject s on te."idSubject"=s.id join school_year sy on sy.id = s."idSchYear" join school sc on sc.id = sy."idSchool" where te."idTeacher" = $1'
    const values = [req.body.id]
    pool.query(query, values, (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error during getAllSchools', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}


// set end date of first semestar in chosen school
const setEndDateOfFirstSem = (req, res) => {
  const query1 =  `SELECT to_char("endOfFirstSem", 'DD-MM-YYYY') as "endOfFirstSem" FROM school_year WHERE "id" = $1`;
  const values1 = [req.body.id];

  pool.query(query1, values1, (error1, results1) => {
    if (error1) {
      return res.status(500).json({ message: 'Error fetching current end date', error: error1 });
    } else {
      const currentEndOfFirstSem = results1.rows[0].endOfFirstSem;
      const query2 = `UPDATE school_year SET "endOfFirstSem" = $1 WHERE "id" = $2 RETURNING to_char("endOfFirstSem", 'DD-MM-YYYY') as "endOfFirstSem"`;
      const values2 = [req.body.date, req.body.id];

      pool.query(query2, values2, (error2, results2) => {
        if (error2) {
          return res.status(500).json({ message: 'Error updating end date', error: error2 });
        } else {
          const updatedEndOfFirstSem = results2.rows[0].endOfFirstSem;
          // console.log('old date: ' + new Date(currentEndOfFirstSem).getTime())
          // console.log('new date: ' + new Date(updatedEndOfFirstSem).getTime())
          const isSameDate = currentEndOfFirstSem === updatedEndOfFirstSem
            // new Date(currentEndOfFirstSem).getTime() === new Date(updatedEndOfFirstSem).getTime();

          if (isSameDate) {
            // If the updated value is the same as the old one, the change did not happen
            return res.status(400).json({ message: 'Novi datum nije validan ili nije bilo promene.' });
          } else {
            // If the value has changed, the update was successful
            return res.status(200).json({ message: 'Uspešna izmena.', updatedEndOfFirstSem });
          }
        }
      });
    }
  });
};

const setStartDateOfSecondSem = (req, res) => {
  const query1 = `SELECT to_char("startOfSecondSem", 'DD-MM-YYYY') as "startOfSecondSem" FROM school_year WHERE "id" = $1`;
  const values1 = [req.body.id];
  // console.log('req date: ' + req.body.date)

  pool.query(query1, values1, (error1, results1) => {
    if (error1) {
      return res.status(500).json({ message: 'Error fetching current end date', error: error1 });
    } else {
      // console.log('old date: ' + results1.rows[0])
      const currentstartOfSecondSem = results1.rows[0].startOfSecondSem;
      const query2 = `UPDATE school_year SET "startOfSecondSem" = $1 WHERE "id" = $2 RETURNING to_char("startOfSecondSem", 'DD-MM-YYYY') as "startOfSecondSem"`;
      const values2 = [req.body.date, req.body.id];

      pool.query(query2, values2, (error2, results2) => {
        if (error2) {
          return res.status(500).json({ message: 'Error updating end date', error: error2 });
        } else {
          const updatedStartOfSecondSem = results2.rows[0].startOfSecondSem;
          // console.log('old date: ' + new Date(currentstartOfSecondSem).getTime())
          // console.log('new date: ' + new Date(updatedStartOfSecondSem).getTime())
          const isSameDate = currentstartOfSecondSem === updatedStartOfSecondSem
            // new Date(currentstartOfSecondSem).getTime() === new Date(updatedStartOfSecondSem).getTime();

          if (isSameDate) {
            // If the updated value is the same as the old one, the change did not happen
            return res.status(400).json({ message: 'Novi datum nije validan ili nije bilo promene.' });
          } else {
            // If the value has changed, the update was successful
            return res.status(200).json({ message: 'Uspešna izmena.', updatedStartOfSecondSem });
          }
        }
      });
    }
  });
};


const setEndOfFirstQ = (req, res) => {
  const query = `update class set "endOfFirstQ" = $1 where id = $2 returning to_char("endOfFirstQ", 'DD-MM-YYYY') as "endOfFirstQ"`
  const currentEndOfFirstQ = req.body.endOfFirstQ
  const values = [req.body.date, req.body.idClass]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error setEndOfFirstQ', error: error });
    } else {
      const updatedEndOfFirstQ = results.rows[0].endOfFirstQ
      if(updatedEndOfFirstQ === currentEndOfFirstQ) {
        res.status(400).json({ message: 'Novi datum nije validan ili nije bilo promene. Datumi za polugodišta moraju biti prvo postavljeni.' });
      }
      else {
        // If the value has changed, the update was successful
        return res.status(200).json({ message: 'Uspešna izmena.', updatedEndOfFirstQ });
      }
    }
  })
}

const setEndOfThirdQ = (req, res) => {
  const query = `update class set "endOfThirdQ" = $1 where id = $2 returning to_char("endOfThirdQ", 'DD-MM-YYYY') as "endOfThirdQ"`
  const currentEndOfThirdQ = req.body.endOfThirdQ
  const values = [req.body.date, req.body.idClass]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error setEndOfThirdQ', error: error });
    } else {
      const updatedEndOfThirdQ = results.rows[0].endOfThirdQ
      console.log(updatedEndOfThirdQ + " " + currentEndOfThirdQ + " " + (updatedEndOfThirdQ === currentEndOfThirdQ))
      if(updatedEndOfThirdQ === currentEndOfThirdQ) {
        res.status(400).json({ message: 'Novi datum nije validan ili nije bilo promene. Datumi za polugodišta moraju biti prvo postavljeni.' });
      }
      else {
        // If the value has changed, the update was successful
        return res.status(200).json({ message: 'Uspešna izmena.', updatedEndOfThirdQ });
      }
    }
  })
}


const getSchYearsForSchoolAndTeacher = (req, res) => {
  const query = `select distinct sy.id, to_char(sy."startDate", 'YYYY-MM-DD') as "startDate", to_char(sy."endDate", 'YYYY-MM-DD') as "endDate", to_char(sy."endOfFirstSem", 'YYYY-MM-DD') as "endOfFirstSem", to_char(sy."startOfSecondSem", 'YYYY-MM-DD') as "startOfSecondSem" from teaches te join subject s on te."idSubject"=s.id join school_year sy on sy.id = s."idSchYear" where te."idTeacher" = $1 and sy."idSchool" = $2`
  const values = [req.body.idTeacher, req.body.idSchool]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getSchYearsForSchoolAndTeacher', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}


const getClassesThatTeacherTeaches = (req, res) => {
  const query = `select distinct c.id, c.year, c.number, c."idTeacher", to_char(c."endOfFirstQ", 'DD-MM-YYYY') as "endOfFirstQ", to_char(c."endOfThirdQ", 'DD-MM-YYYY') as "endOfThirdQ" from listens l join student s on l."jmbg" = s.jmbg join class c on s."idClass" = c.id where l."idTeacher" = $1 and c."idSchYear"= $2`  
  const values = [req.body.idTeacher, req.body.idSchYear]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getClassesThatTeacherTeaches', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getSubjectsThatTeacherTeachesToThatClass = (req, res) => {
  const query = 'select distinct s.id, s.name, s.description from subject s join listens l on s.id = l."idSubject" 	join student st on st.jmbg = l.jmbg where l."idTeacher" = $1 and s."idSchYear"= $2 and st."idClass" = $3'
  const values = [req.body.idTeacher, req.body.idSchYear, req.body.idClass]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getSubjectsThatTeacherTeachesToThatClass', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}
// WORK DAYS
const getWeeksAndDays = (req, res) => {
  const query = `SELECT wd."idSchYear", to_char(date, 'DD-MM-YYYY') as "date", UPPER(TO_CHAR(date, 'Dy')) AS day_of_week, "teachingDay", number FROM w_day wd JOIN w_week ww ON (wd."weekNumber" = ww."number" AND wd."idSchYear" = ww."idSchYear") WHERE ww."idSchYear" = $1 AND date <= (select DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '4 days') ORDER BY wd."weekNumber" DESC, date ASC;`
  const values = [req.body.idSchYear]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getWeeksAndDays', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getWDay = (req, res) => {
  const query = `select "idSchYear", to_char(date, 'DD-MM-YYYY') as "date", "teachingDay", "weekNumber", note from w_day where "idSchYear" = $1 and date = $2;`
  const values = [req.body.idSchYear, req.body.date]
  // console.log(req.body.idSchYear + " " + req.body.date)
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getWDay', error: error });
    } else {
      // console.log(results.rows[0])
      res.status(200).json(results.rows[0])
    }
  })
}

const toggleTeachingDay = (req, res) => {
  const query = 'update w_day set "teachingDay" = NOT "teachingDay" where "idSchYear" = $1 and date = $2;'
  const values = [req.body.idSchYear, req.body.date]
  // console.log(req.body.idSchYear + " " + req.body.date)
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error toggleTeachingDay', error: error });
    } else {
      // console.log("here")
      res.status(200).json()
    }
  })
}

const updateNote = (req, res) => {
  const query = `UPDATE public.w_day SET note= $1 WHERE "idSchYear" = $2 and date = $3;`;
  const values = [req.body.note, req.body.idSchYear, req.body.date]
  // console.log(req.body.idSchYear + " " + req.body.date)
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error toggleTeachingDay', error: error });
    } else {
      // console.log("here")
      res.status(200).json()
    }
  })
}
// const insertClass = (req, res) => {
//   const query = 'INSERT INTO w_class("idSchYear", "number", date, "idSubject", "idTeacher", "idClass", lesson, "currDate", types, note, shift) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;'
//   const values = [req.body.idSchYear, req.body.number, req.body.date, req.body.idSubject, req.body.idTeacher, req.body.idClass, req.body.lecture, req.body.currDate, req.body.type, req.body.note, req.body.shift]
//   const query1 = 'INSERT INTO missing_student("idClass", jmbg)	VALUES ($1, $2);'
//   // console.log(req.body.missStud)
//   pool.query(query, values, (error, results) => {
//         if (error) {
//           return res.status(500).json({ message: 'Error insertClass', error: error });
//         } else {
//           // 
//           let missing_students = [] 
//           missing_students = req.body.missStud
//           for (let index = 0; index < missing_students.length; index++) {
//             pool.query(query1, [results.rows[0].id, missing_students[index]], (error, results) => {
//               if (error) {
//                 return res.status(500).json({ message: 'Error insertClass', error: error });
//               } else {
//                 // if(index + 1 == missing_students.length && req.body.blockNum <= 0) res.status(200).json({})
//               }
//             })
            
//           }
//           // missing_students.foreach(elem => {
//           //   pool.query(query1, elem)
//           // })


//           if(req.body.blockNum > 0) {
//             let i = 1;
//             while(i < req.body.blockNum) {
//               const values = [req.body.idSchYear, req.body.number + i++, req.body.date, req.body.idSubject, req.body.idTeacher, req.body.idClass, req.body.lecture, req.body.currDate, req.body.type, req.body.note]
//               pool.query(query, values, (error, results) => {
//                 if(error) {
//                   return res.status(500).json({ message: 'Error insertClass', error: error });
//                 } else {
//                     // adding missing students
//                     for (let index = 0; index < missing_students.length; index++) {
//                       pool.query(query1, [results.rows[0].id, missing_students[index]])
//                     }
//                 }
//               })
//             }
//             res.status(200).json({})
//           } else {
//             res.status(200).json({})
//           }
//         }
//   })
// }

const insertClass = async (req, res) => {
    const poolQuery = (query, values) => new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    try {
      const insertClassQuery = 'INSERT INTO w_class("idSchYear", "number", date, "idSubject", "idTeacher", "idClass", lesson, "currDate", types, note, shift) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;';
      const insertMissingStudentQuery = 'INSERT INTO missing_student("idClass", jmbg, note) VALUES ($1, $2, $3);';
      const insertNotesOnGovernance = `INSERT INTO note_on_governance("idClass", jmbg, note, "additionalNote")
                                        VALUES ($1, $2, $3, $4);`

      // Inserting the main class record
      const classResult = await poolQuery(insertClassQuery, [
        req.body.idSchYear, req.body.number, req.body.date, req.body.idSubject, req.body.idTeacher, req.body.idClass,
        req.body.lecture, req.body.currDate, req.body.type, req.body.note, req.body.shift
      ]);

      const classId = classResult.rows[0].id;
      const missingStudents = req.body.missStud;
      const studBehav = req.body.notesOnGov

      // Inserting missing students for the class
      // this.classInfo.missStud.push({jmbg: element.jmbg, note: student.note})
      for (const student of missingStudents) {
        await poolQuery(insertMissingStudentQuery, [classId, student.jmbg, student.note]);
      }

      // Inserting notes on governance for the class
      // this.classInfo.notesOnGov.push({jmbg: element.jmbg, note: element.behaviour, additionalNote: arrNote})
      for (const student of studBehav) {
        await poolQuery(insertNotesOnGovernance, [classId, student.jmbg, student.note, student.additionalNote]);
      }

      // If blockNum is greater than 0, insert additional records
      if (req.body.blockNum > 0) {
        for (let i = 1; i < req.body.blockNum; i++) {
          const additionalClassResult = await poolQuery(insertClassQuery, [
            req.body.idSchYear, Number(req.body.number) + i, req.body.date, req.body.idSubject, req.body.idTeacher, req.body.idClass,
            req.body.lecture, req.body.currDate, req.body.type, req.body.note, req.body.shift
          ]);

          const additionalClassId = additionalClassResult.rows[0].id;

          // Inserting missing students for each additional class
          for (const student of missingStudents) {
            await poolQuery(insertMissingStudentQuery, [additionalClassId, student.jmbg, student.note]);
          }
          // Inserting notes on governance for the class
          for (const student of studBehav) {
            await poolQuery(insertNotesOnGovernance, [additionalClassId, student.jmbg, student.note, student.additionalNote]);
          }
        }
      }

      // Send a success response after all operations are completed
      res.status(200).json({ message: 'Class and missing students and notes on governance inserted successfully' });

    } catch (error) {
      res.status(500).json({ message: 'Error occurred during insertClass', error: error.message });
    }
};


const insertNotHeldClass = (req, res) => {
  const query = 'INSERT INTO w_class("idSchYear", "number", date, "idSubject", "idTeacher", "idClass", "currDate", held, shift) VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8) returning *;'
  const values = [req.body.idSchYear, req.body.number, req.body.date, req.body.idSubject, req.body.idTeacher, req.body.idClass, req.body.currDate, req.body.shift]
  pool.query(query, values, (error, results) => {
    if(error) {
      return res.status(500).json({ message: 'Error insertNotHeldClass', error: error });
    }
    else {
      res.status(200).json(results.rows[0])
    }  
  })
}

const deleteMissStudAndWclass = (req, res) => {
  // deletes class, missing students and notes on governance
  const query = `select "deleteMissStudAndWclass"($1);`
  const values = [req.body.id]
 //  console.log('deleteMissStudAndWclass: id = ' + req.body.id)
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error deleteMissStudAndWclass', error: error });
    } else {
      // console.log("here")
      res.status(200).json()
    }
  })
}

const getClassTypes = (req, res) => {
  const query = 'select * from class_type'
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error insertClass', error: error });
    } else {
      // console.log(results.rows[0])
      res.status(200).json(results.rows)
    }
  })
}

const findClassesForDate = (req, res) => {
  const query = 'SELECT wc.held, wc.id, "idTeacher", t.firstname, t.lastname, s.id as "idSubject", s."name", "number", lesson, note, types, "idClass", shift FROM w_class wc join subject s on wc."idSubject" = s.id join teacher t on wc."idTeacher" = t.id WHERE date = $1 and wc."idSchYear" = $2 and "idClass" = $3 ORDER BY number;'
  const values = [req.body.date, req.body.idSchYear, req.body.idClass]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error findClassesForDate', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const findPreviousLesson = (req, res) => {
  const query = ` SELECT lesson, to_char(date, 'DD-MM-YYYY') as date
                  FROM w_class 
                  WHERE "idSchYear" = $1 and "idSubject" = $2 and "idClass" = $3 and held = true and date <= $4
                  ORDER BY date desc, number desc LIMIT 1;`
  const values = [req.body.idSchYear, req.body.idSubject, req.body.idClass, req.body.date]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error findPreviousLesson', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

//select * from w_class where "idSchYear" = 1 and "idClass" = 1 and date = '2024-09-02' and number = 3
const classNumInDateExists = (req, res) => {
  const query = `select id, "idSchYear", "idTeacher", "idSubject", to_char(date, 'DD-MM-YYYY') as "date", to_char("currDate", 'DD-MM-YYYY') as "currDate", "number", lesson, note, types, "idClass" from w_class where "idSchYear" = $1 and "idClass" = $2 and date = $3 and number = $4`
  const values = [req.body.idSchYear, req.body.idClass, req.body.date, req.body.number]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error classNumInDateExists', error: error });
    } else {
      // console.log(results.rowCount)
      res.status(200).json(results.rowCount)
    }
  })
}

const classNumInDateExistsBlock = (req, res) => {


}

const getStudentsInClass = (req, res) => {
  const query = 'select * from student where "idClass" = $1 order by lastname asc, firstname asc';
  const values = [req.body.idClass]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getStudentsInClass', error: error });
    } else {
      // console.log(results.rows[0])


      res.status(200).json(results.rows)
    }
  })
}

// ---------------------------------
const serbianAlphabet = [
  'a', 'b', 'v', 'g', 'd', 'đ', 'e', 'ž', 'z', 'i', 'j', 'k', 'l', 'lj', 'm',
  'n', 'nj', 'o', 'p', 'r', 's', 't', 'ć', 'u', 'f', 'h', 'c', 'č', 'dž', 'š'
];

// Function to compare strings based on Serbian alphabet order
function serbianCompare(a, b) {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  for (let i = 0; i < Math.min(aLower.length, bLower.length); i++) {
    const aChar = aLower[i]; 
    const bChar = bLower[i];

    const aIndex = serbianAlphabet.indexOf(aChar);
    const bIndex = serbianAlphabet.indexOf(bChar);

    if (aIndex !== bIndex) {  return aIndex - bIndex;  }
  }
  return aLower.length - bLower.length;
}

const getStudentsInClassOrder = (req, res) => {
  const query = 'select * from student where "idClass" = $1;';
  const values = [req.body.idClass]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getStudentsInClassOrder', error: error });
    } else {
      // Sort the array using the custom Serbian alphabet comparator
      results.rows.sort((a, b) => {
        const lastnameComparison = serbianCompare(a.lastname, b.lastname);
        if (lastnameComparison === 0) {
          // If lastnames are the same, compare by firstname
          return serbianCompare(a.firstname, b.firstname);
        }
        return lastnameComparison;
      });
      
      let jmbgArray = results.rows.map(row => row.jmbg);
      
      const query1 = `SELECT public.assign_monitors($1, $2::JSONB, $3)`;
      const values1 = [req.body.idClass, JSON.stringify(results.rows), jmbgArray.length];

      pool.query(query1, values1, (error1, results1) => {
        if (error1) {
          return res.status(500).json({ message: 'Error getStudentsInClassOrder', error: error1 });
        } else {
          res.status(200).json({message: 'monitors assigned'})
        }
      })
    }
  })
}


const getMonitorsForClass = (req, res) => {
  const query = `select monitors.*, s1.firstname as firstname1, s1.lastname as lastname1, s2.firstname as firstname2, s2.lastname as lastname2
                from monitors join student s1 on monitors.jmbg1 = s1.jmbg join student s2 on monitors.jmbg2 = s2.jmbg 
                where monitors."idClass" = $1 and "idSchYear" = $2
                order by number desc`
  const values = [req.body.idClass, req.body.idSchYear]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getMonitorsForClass', error: error });
    } else {
      // console.log(results.rows[0])
      res.status(200).json(results.rows)
    }
  })
}



const getStudentsInClassListensSubj = (req, res) => {
  const query = 'select * from student s join listens l on s.jmbg = l.jmbg where "idClass" = $1 and "idSubject" = $2 and "idTeacher" = $3 order by lastname asc, firstname asc';
  const values = [req.body.idClass, req.body.idSubject, req.body.idTeacher]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getStudentsInClassListensSubj', error: error });
    } else {
      // console.log(results.rows[0])
      res.status(200).json(results.rows)
    }
  })
}

const getMissStudFromPreviousClass = (req, res) => {
  const query = ` SELECT number, wc.id as "idClass", s.jmbg, firstname, lastname
                FROM missing_student ms join student s on ms.jmbg = s.jmbg 
                            join w_class wc on ms."idClass" = wc.id
                WHERE wc.date = $1 and wc.held = true and wc.number < $2 and wc."idClass" = $3
                ORDER BY number desc
                LIMIT 1
                `;
  const values = [req.body.date, req.body.number, req.body.idClass]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getMissStudFromPreviousClass', error: error });
    } else {
      // console.log(results.rows[0])
      res.status(200).json(results.rows)
    }
  })
}

const getGradingType = (req, res) => {
  const query = `select gt.* 
              from grading_types gt join subject_grading_type sgt on sgt."idGradingType" = gt.id
              where "idClass" = $1 and "idTeacher" = $2 and "idSubject" = $3`;
  const values = [req.body.idClass, req.body.idTeacher, req.body.idSubject]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getGradingType', error: error });
    } else {
      // console.log(JSON.stringify(results.rows[0].values))
      res.status(200).json(results.rows)
    }
  })
}



const getGradeTypes = (req, res) => {
  const query = `select * from grade_types`;
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getGradeTypes', error: error });
    } else {
      // console.log(results.rows[0])
      res.status(200).json(results.rows)
    }
  })
}

const checkDateAndWClass = (req, res) => {
  const query = `select *
  from w_day wd join w_class wc on (wc.date = wd.date and wc."idSchYear" = wd."idSchYear")
  where wd.date = $1 and wd."idSchYear" = $2 and "teachingDay" = true and 
  "idClass" = $3 and "idSubject" = $4 and "idTeacher" = $5 and held = true`;
  const values = [req.body.date, req.body.idSchYear, req.body.idClass, req.body.idSubject, req.body.idTeacher]
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error checkDateAndWClass', error: error });
    } else {
      // console.log(JSON.stringify(results.rows[0].values))
      res.status(200).json(results.rows)
    }
  })
}


const insertGrade = (req, res) => {
  const query = `INSERT INTO public.grade(
                  jmbg, "idClass", "idSubject", "idTeacher", "idGradingType", 
                  grade, date, "currDate", note, "idGradeType", "finalGrade")
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *;`;
  const values = [
    req.body.jmbg,           // jmbg
    req.body.idClass,        // "idClass"
    req.body.idSubject,      // "idSubject"
    req.body.idTeacher,      // "idTeacher"
    req.body.idGradingType,  // "idGradingType"
    req.body.grade,          // grade
    req.body.date,           // date
    req.body.currDate,       // "currDate"
    req.body.note,           // note
    req.body.idGradeType,     // "idGradeType"
    req.body.finalGrade
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error insertGrade', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const getStudGrades = (req, res) => {
  const query = `select g.id, jmbg, "idClass", "idSubject", "idTeacher", "idGradingType",  t.firstname, t.lastname,
                grade, to_char(date, 'DD-MM-YYYY') as date, to_char("currDate", 'DD-MM-YYYY') as "currDate", note, "gradeCorr", average, "idGradeType", "deletionReq" , "finalGrade" 
                from grade g join teacher t on g."idTeacher" = t.id
                where jmbg = $1 and "idSubject" = $2`
  const values = [
    req.body.jmbg,           // jmbg
    req.body.idSubject      // "idSubject"
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error getStudGrades', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
} 

const averageGradeYear = (req, res) => {
  const query = `select calculate_average_grade($1, $2)  as average;`
  const values = [
    req.body.jmbg,           // jmbg
    req.body.idSubject      // "idSubject"
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error averageGradeYear', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
} 
const averageGradeSem1 = (req, res) => {
  const query = `select calculate_average_grade_sem1($1, $2)  as average;`
  const values = [
    req.body.jmbg,           // jmbg
    req.body.idSubject      // "idSubject"
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error averageGradeSem1', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
} 
const averageGradeSem2 = (req, res) => {
  const query = `select calculate_average_grade_sem2($1, $2)  as average;`
  const values = [
    req.body.jmbg,           // jmbg
    req.body.idSubject      // "idSubject"
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error averageGradeSem2', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
} 


const getDatesInYearForClass = (req, res) => {
  const query = `select to_char(sy."endOfFirstSem", 'DD-MM-YYYY') as "endOfFirstSem",
                        to_char("startOfSecondSem", 'DD-MM-YYYY') as "startOfSecondSem",
                        to_char("endOfFirstQ", 'DD-MM-YYYY') as "endOfFirstQ",
                        to_char("endOfThirdQ", 'DD-MM-YYYY') as "endOfThirdQ",
                        to_char("endDate", 'DD-MM-YYYY') as "endDate",
                        to_char("startDate", 'DD-MM-YYYY') as "startDate"
                from class c join school_year sy on c."idSchYear" = sy.id
                where c.id = $1`
  const values = [
    req.body.idClass
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error getDatesInYearForClass', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const sendDeletionReq = (req, res) => {
  const query = `update grade set "deletionReq" = 1 where id = $1 returning "deletionReq";`
  const values = [
    req.body.id
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error sendDeletionReq', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const updateGrade = (req, res) => {
  const query = `UPDATE public.grade SET "gradeCorr" = $1 WHERE id = $2;`
  const values = [
    req.body.newGrade,
    req.body.id
  ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error updateGrade', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}
// admin queries

const getSchoolAndSchoolYear = (req, res) => {
  const query = `select s.id as "idSchool", s.name, s.address, s.city, sy.id as "idSchYear", 
                  to_char(sy."startDate", 'DD-MM-YYYY') as "startDate", 
                  to_char(sy."endDate", 'DD-MM-YYYY') as "endDate",
                  to_char(sy."endOfFirstSem", 'DD-MM-YYYY') as "endOfFirstSem", 
                  to_char(sy."startOfSecondSem", 'DD-MM-YYYY') as "startOfSecondSem"
                  from school s join school_year sy on sy."idSchool" = s.id join works_at on sy.id = works_at."idSchYear"
                  where works_at.id = $1;`
  const values = [ req.body.id ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error getSchoolAndSchoolYear', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}
// -- get classes and head techers for selected school year
const getClassesAndHeadTeacher = (req, res) => {
  const query = `select c.id as "idClass", year, number, "idTeacher", firstname, lastname,
  to_char(c."endOfFirstQ", 'DD-MM-YYYY') as "endOfFirstQ", 
  to_char(c."endOfThirdQ", 'DD-MM-YYYY') as "endOfThirdQ"
  from class c join school_year sy on sy.id = c."idSchYear" join teacher on teacher.id = c."idTeacher"
  where sy.id = $1;`
  const values = [ req.body.idSchYear ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error getClassesAndHeadTeacher', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}



const getDeletionReq = (req, res) => {
  const query = `select g.*, s.firstname as firstnameStudent, s.lastname as lastnameStudent, su.name, t.firstname as firstnameTeacher, t.lastname as lastnameTeacher
      from grade g join student s on s.jmbg = g.jmbg join subject su on
      g."idSubject" = su.id join teacher t on g."idTeacher" = t.id
      where "deletionReq" = 1 and g."idClass" = $1`
  const values = [ req.body.idClass ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error getDeletionReq', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const deleteGrade = (req, res) => {
 const query = `delete from grade where id = $1;`
  const values = [ req.body.id ];
    pool.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error geleteGrade', error: error });
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const hasMonitors = (req, res) => {
  const query = `select * from monitors where "idClass"=$1;`
   const values = [ req.body.idClass ];
     pool.query(query, values, (error, results) => {
       if (error) {
         return res.status(500).json({ message: 'Error hasMonitors', error: error });
       } else {
         res.status(200).json(results.rows)
       }
     })
 }


const studentsAbsences = (req, res) => {
  const query = `select wc.id as idWClass, wc."idTeacher", t1.firstname as firstname1, t1.lastname as lastname1,
                to_char(wc.date, 'DD-MM-YYYY') as date, lesson, wc.number, wc."idSubject", su.name,
                ms."excusedAbsence", ms.note, 
                c."idTeacher" as "idHeadTeacher", t2.firstname as "firstnameHead", t2.lastname as "lastnameHead"
                from missing_student ms join w_class wc on wc."id" = ms."idClass" 
                join student s on ms.jmbg = s.jmbg 
                join class c on s."idClass" = c.id
                join subject su on wc."idSubject" = su.id
                join teacher t1 on t1.id = wc."idTeacher"
                join teacher t2 on t2.id = c."idTeacher"
                where ms.jmbg = $1`
   const values = [ req.body.jmbg ];
     pool.query(query, values, (error, results) => {
       if (error) {
         return res.status(500).json({ message: 'Error studentsAbsences', error: error });
       } else {
         res.status(200).json(results.rows)
       }
     })
 }



const studentsAbsencesStatusChange = (req, res) => {
  const query = `UPDATE public.missing_student
                SET  "excusedAbsence"=$1
                WHERE "idClass"=$2 and jmbg=$3
                returning *;`
   const values = [req.body.excusedAbsence, req.body.idClass, req.body.jmbg ];
     pool.query(query, values, (error, results) => {
       if (error) {
         return res.status(500).json({ message: 'Error studentsAbsencesStatusChange', error: error });
       } else {
         res.status(200).json(results.rows)
       }
     })
 }

 const studentsNoG = (req, res) => {
  const query = `SELECT nog.jmbg, nog."idClass" as idwclass, nog.note, nog."additionalNote",
                wc."idTeacher", to_char(wc.date, 'DD-MM-YYYY') as date, lesson, wc.number, wc."idSubject",
                t1.firstname as firstname1, t1.lastname as lastname1, su.name, 
                c."idTeacher" as "idHeadTeacher", t2.firstname as "firstnameHead", t2.lastname as "lastnameHead"
                FROM note_on_governance nog join w_class wc on wc."id" = nog."idClass"
                JOIN student s on nog.jmbg = s.jmbg 
                join class c on s."idClass" = c.id
                join subject su on wc."idSubject" = su.id
                join teacher t1 on t1.id = wc."idTeacher"
                join teacher t2 on t2.id = c."idTeacher"
                where nog.jmbg = $1;`

  const values = [ req.body.jmbg ];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error studentsNoG', error: error });
        } else {
          res.status(200).json(results.rows)
        }
      })
}



const addDisciplinaryMeasure = (req, res) => {
  const query = `INSERT INTO public.disciplinary_measure(
    jmbg, "idSchYear", date, title, p_or_d, effect)
    VALUES ($1, $2, $3, $4, $5, $6);`

  const values = 
  [ req.body.jmbg , req.body.idSchYear, 
    req.body.date, req.body.title, 
    req.body.p_or_d, req.body.effect];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error addDisciplinaryMeasure', error: error });
        } else {
          res.status(200).json({})
        }
      })
}

const getDisciplinaryMeasures = (req, res) => {
  const query = `SELECT jmbg, "idSchYear", to_char(date, 'DD-MM-YYYY') as date, title, p_or_d, effect
                FROM public.disciplinary_measure
                WHERE "jmbg" = $1 and "idSchYear" = $2;`

  const values =  [ req.body.jmbg , req.body.idSchYear];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error getDisciplinaryMeasures', error: error });
        } else {
          res.status(200).json(results.rows)
        }
      })
}


const updateStudentsInfo = (req, res) => {
  const query = ` UPDATE public.student
                SET firstname=$1, lastname=$2, address=$3, email=$4, phone=$5, 
                    parent1_firstname=$6, parent1_lastname=$7, parent1_phone=$8, parent1_email=$9, 
                    parent2_firstname=$10, parent2_lastname=$11, parent2_phone=$12, parent2_email=$13
                WHERE jmbg = $14;`
  const values = [
    req.body.firstname,            // $1
    req.body.lastname,             // $2
    req.body.address,              // $3
    req.body.email,                // $4
    req.body.phone,                // $5
    req.body.parent1_firstname,    // $6
    req.body.parent1_lastname,     // $7
    req.body.parent1_phone,        // $8
    req.body.parent1_email,        // $9
    req.body.parent2_firstname,    // $10
    req.body.parent2_lastname,     // $11
    req.body.parent2_phone,        // $12
    req.body.parent2_email,        // $13
    req.body.jmbg                  // $14 (for the WHERE condition)
  ];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error updateStudentsInfo', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getHeadTeacher = (req, res) => {
  const query = `select t.*
                  from student s join class c on s."idClass" = c.id
                  join teacher t on t.id = c."idTeacher"
                  where jmbg = $1;`

  const values =  [ req.body.jmbg ];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error getHeadTeacher', error: error });
        } else {
          res.status(200).json(results.rows)
        }
      })
}

const getSubjectsAndTeachersForStudent = (req, res) => {
  const query = `select l.*, su.name, su.description, t.firstname, t.lastname
                from listens l join subject su on l."idSubject" = su.id
                join teacher t on l."idTeacher" = t.id
                where jmbg = $1 and su."idSchYear" = $2`

  const values =  [ req.body.jmbg, req.body.idSchYear ];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error getSubjectsAndTeachersForStudent', error: error });
        } else {
          res.status(200).json(results.rows)
        }
      })
}

// adding new subject for student, queries
const getSubjectsInSchYear = (req, res) => {
  const query = `select * from subject where "idSchYear" = $1;` 

  const values =  [ req.body.idSchYear ];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error getSubjectsInSchYear', error: error });
        } else {
          res.status(200).json(results.rows)
        }
      })
}

const getTeachersThatTeachesSubj = (req, res) => {
  const query = `select t.id, t.firstname, t.lastname from teacher t join teaches te on t.id = te."idTeacher" where "idSubject" = $1`

  const values =  [  req.body.idSubject ];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error getTeachersThatTeachesSubj', error: error });
        } else {
          res.status(200).json(results.rows)
        }
      })
}

const getGradingTypeForAddingSubj = (req, res) => {
  const query = `select gt.*
              from subject_grading_type sgt join grading_types gt on sgt."idGradingType" = gt.id
              where "idTeacher" = $1 and "idSubject" = $2 and "idClass" = $3;`
  console.log(JSON.stringify(req.body, null, 2))
  const values =  [ req.body.idTeacher, req.body.idSubject, req.body.idClass ];
      pool.query(query, values, (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error getGradingTypeForAddingSubj', error: error });
        } else {
          console.log(JSON.stringify(results.rows, null, 2))
          res.status(200).json(results.rows)
        }
      })
}

const getAllGradingTypes = (req, res) => {
  const query = `select * from grading_types`
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getAllGradingTypes', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const insertIntoListens = (req, res) => {
  const query = `INSERT INTO public.listens("idTeacher", "idSubject", jmbg) VALUES ($1, $2, $3);`
  const values =  [ req.body.idTeacher, req.body.idSubject, req.body.jmbg ];
  pool.query(query, values, (error, results) => {
    if (error) {
      console.log(JSON.stringify(error, null, 2))
      if(error.constraint != null && error.constraint == 'listens_pkey') {
        const message = 'Učenik već sluša predmet kod odabranog nastavnika.'
        return res.status(400).json({message: message})
      }
      return res.status(500).json({ message: 'Error insertIntoListens', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const insertIntoSubjGradType = (req, res) => {
  const query = `INSERT INTO public.subject_grading_type("idClass", "idSubject", "idTeacher", "idGradingType") 	VALUES ($1, $2, $3, $4);`
  const values =  [ req.body.idClass, req.body.idSubject, req.body.idTeacher, req.body.idGradingType ];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error insertIntoSubjGradType', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const deleteFromListens = (req, res) => {
  const query = `DELETE FROM public.listens
                  WHERE "idSubject" = $1 and "idTeacher" = $2 and jmbg = $3;`
  const values =  [  req.body.idSubject, req.body.idTeacher, req.body.jmbg ];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error deleteFromListens', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getSuccess = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    const getSubjectsQuery = `select l."idTeacher", s.* from listens l left join subject s on l."idSubject" = s.id 
                              where s."idSchYear" = $1 and jmbg = $2  order by "idSubject";`
    const getFinalGradesForSubject = `select * from grade g 
                                      where jmbg = $1 and "idSubject" = $2 and "finalGrade" IN (1, 2)
                                      order by "finalGrade"`
    
    const subjResult = await poolQuery( getSubjectsQuery, [req.body.idSchYear, req.body.jmbg] )
    // console.log(JSON.stringify(subjResult.rows, null, 2))
    let gradeMap = new Map()
    for(const subj of subjResult.rows) {
      console.log(subj.id)
      const result = await poolQuery(getFinalGradesForSubject, [req.body.jmbg, subj.id])
      gradeMap.set(JSON.stringify(subj), result.rows)
      // console.log(JSON.stringify(gradeMap.get(subj), null, 2))
    }

    // Convert the Map to a plain object before sending it to the frontend
    const gradeMapObject = Object.fromEntries(gradeMap);
    res.status(200).json(gradeMapObject)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during getSuccess', error: error.message });
  }
}

const getAllGrades = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    const getSubjectsQuery = `select l."idTeacher", s.* from listens l left join subject s on l."idSubject" = s.id 
                              where s."idSchYear" = $1 and jmbg = $2  order by "idSubject";`

    const queryFirstQ = `select to_char("startDate", 'YYYY-MM-DD') as "date1", 
                          to_char("endOfFirstQ", 'YYYY-MM-DD') as "date2"
                        from school_year sy join class c on sy.id = c."idSchYear"
                        where c."id" = $1;`

    const queryFirstS = `select to_char("startDate", 'YYYY-MM-DD') as "date1", 
                          to_char("endOfFirstSem", 'YYYY-MM-DD') as "date2"
                        from school_year sy
                        where "id" = $1;`

    const queryThirdQ = `select to_char("startOfSecondSem", 'YYYY-MM-DD') as "date1", 
                          to_char("endOfThirdQ", 'YYYY-MM-DD') as "date2"
                        from school_year sy join class c on sy.id = c."idSchYear"
                        where c."id" = $1;`

    const querySecondS = `select to_char("startOfSecondSem", 'YYYY-MM-DD') as "date1", 
                          to_char("endDate", 'YYYY-MM-DD') as "date2"
                        from school_year sy
                        where "id" = $1;`

    const queryYear = `select to_char("startDate", 'YYYY-MM-DD') as "date1", 
                        to_char("endDate", 'YYYY-MM-DD') as "date2"
                      from school_year sy
                      where "id" = $1;`

    const getAllGradesForSubject = `select * from grade g 
                                    where jmbg = $1 and "idSubject" = $2 and "finalGrade" = 0 and date BETWEEN $3 AND $4;`
    
    const subjResult = await poolQuery( getSubjectsQuery, [req.body.idSchYear, req.body.jmbg] )
    // '1. tromesečje', '1. polugodište', '3. tromesečje', '2. polugodište', 'Cela godina'
    let periodResult
    switch (req.body.period) {
      case '1. tromesečje':
        periodResult = await poolQuery(queryFirstQ, [req.body.idClass])
        break;
      case '1. polugodište':
        periodResult = await poolQuery(queryFirstS, [req.body.idSchYear])
        break;
      case '3. tromesečje':
        periodResult = await poolQuery(queryThirdQ, [req.body.idClass])
        break;
      case '2. polugodište':
        periodResult = await poolQuery(querySecondS, [req.body.idSchYear])
        break;
      case 'Cela godina':
        periodResult = await poolQuery(queryYear, [req.body.idSchYear])
        break;
    
      default:
        break;
    }
    const date1 = periodResult.rowCount > 0 ? periodResult.rows[0].date1 : null
    const date2 = periodResult.rowCount > 0 ? periodResult.rows[0].date2 : null
    // console.log(JSON.stringify(subjResult.rows, null, 2))
    let gradeMap = new Map()
    for(const subj of subjResult.rows) {
      console.log(subj.id)
      const result = await poolQuery(getAllGradesForSubject, [req.body.jmbg, subj.id, date1, date2])
      gradeMap.set(JSON.stringify(subj), result.rows)
      // console.log(JSON.stringify(gradeMap.get(subj), null, 2))
    }

    // Convert the Map to a plain object before sending it to the frontend
    const gradeMapObject = Object.fromEntries(gradeMap);
    res.status(200).json(gradeMapObject)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during getAllGrades', error: error.message });
  }
}

// REPORT
// all students in class with all subjects that someone from class listens to and their grades from those subjects

const isHeadTeacher = (req, res) => {
  const query = `select * from class where "idSchYear" = $1 and "idTeacher" = $2;`
  const values =  [  req.body.idSchYear , req.body.idTeacher];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error isHeadTeacher', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const report1 = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    const query = `WITH students_in_class AS (
                    SELECT DISTINCT s.jmbg, s."idClass", s.firstname, s.lastname
                    FROM student s
                    WHERE s."idClass" = (SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2)
                  ),
                  subjects_for_class AS (
                    SELECT DISTINCT su.id AS subject_id, su.name AS subject_name
                    FROM student s
                    JOIN listens l ON s.jmbg = l.jmbg
                    JOIN subject su ON l."idSubject" = su.id
                    WHERE s."idClass" = (SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2)
                  ),
                  student_subjects AS (
                    SELECT s.jmbg, su.subject_id, su.subject_name, s.firstname, s.lastname
                    FROM students_in_class s
                    CROSS JOIN subjects_for_class su
                  )
                  SELECT ss.jmbg, ss.firstname, ss.lastname, ss.subject_id as "idSubject", ss.subject_name as name, g.grade, g."finalGrade"
                  FROM student_subjects ss
                  LEFT JOIN grade g ON ss.jmbg = g.jmbg AND g."idSubject" = ss.subject_id AND g."finalGrade" = 0
                  ORDER BY ss.jmbg, ss.subject_id; `
    const results = await poolQuery( query, [req.body.idTeacher, req.body.idSchYear] )
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during report1', error: error.message });
  }
}

const report2 = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    const query = `WITH students_in_class AS (
  SELECT DISTINCT s.jmbg, s."idClass", s.firstname, s.lastname
  FROM student s
  WHERE s."idClass" = (SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2)
),
subjects_for_class AS (
  SELECT DISTINCT su.id AS subject_id, su.name AS subject_name
  FROM student s
  JOIN listens l ON s.jmbg = l.jmbg
  JOIN subject su ON l."idSubject" = su.id
  WHERE s."idClass" = (SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2)
),
student_subjects AS (
  SELECT s.jmbg, su.subject_id, su.subject_name, s.firstname, s.lastname
  FROM students_in_class s
  CROSS JOIN subjects_for_class su
)
SELECT ss.jmbg, ss.firstname, ss.lastname, ss.subject_id as "idSubject", ss.subject_name as name, g.grade, g."finalGrade", g."idGradingType"
FROM student_subjects ss
LEFT JOIN grade g ON ss.jmbg = g.jmbg AND g."idSubject" = ss.subject_id AND g."finalGrade" = 2
ORDER BY ss.jmbg, ss.subject_id; `
    const results = await poolQuery( query, [req.body.idTeacher, req.body.idSchYear] )
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during report2', error: error.message });
  }
}

const report31 = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    const query0 = `SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2;`
    const query = `WITH grade_summary AS (
    SELECT
        s.jmbg,
        s.firstName,
        s.lastName,
        AVG(
            CASE 
                WHEN g.grade != 'oslobođen' THEN CAST(g.grade AS FLOAT)
                ELSE NULL 
            END
        ) AS avg_grade,
        MAX(
            CASE 
                WHEN g.grade = '1' THEN 1
                ELSE 0
            END
        ) AS has_grade_one
    FROM
        student s
    JOIN
        grade g ON s.jmbg = g.jmbg
    WHERE
        s."idClass" = $1
        AND g."finalGrade" = 1
        AND g."idClass" = $1
    GROUP BY
        s.jmbg, s.firstName, s.lastName
)

SELECT
    COUNT(
        CASE 
            WHEN has_grade_one = 1 THEN 1  -- Student has at least one grade of 1
            ELSE NULL
        END
    ) AS "numNotEnough",  -- Students with at least one grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 4.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numExcellent",  -- Students with average grade above 4.5 and no grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 3.5 AND avg_grade <= 4.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numVeryGood",  -- Students with average grade above 3.5 and up to 4.5 and no grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 2.5 AND avg_grade <= 3.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numGood",  -- Students with average grade above 2.5 and up to 3.5 and no grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 1.5 AND avg_grade <= 2.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numEnough",  -- Students with average grade above 1.5 and up to 2.5 and no grade of 1
    COUNT(*) AS "numTotal"  -- Total number of students
FROM
    grade_summary;`
    const results0 = await poolQuery( query0, [req.body.idTeacher, req.body.idSchYear] )
    const results = await poolQuery( query, [results0.rows[0].id] )
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during report31', error: error.message });
  }
}

const report32 = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    const query0 = `SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2;`
    const query = `WITH grade_summary AS (
    SELECT
        s.jmbg,
        s.firstName,
        s.lastName,
        AVG(
            CASE 
                WHEN g.grade != 'oslobođen' THEN CAST(g.grade AS FLOAT)
                ELSE NULL 
            END
        ) AS avg_grade,
        MAX(
            CASE 
                WHEN g.grade = '1' THEN 1
                ELSE 0
            END
        ) AS has_grade_one
    FROM
        student s
    JOIN
        grade g ON s.jmbg = g.jmbg
    WHERE
        s."idClass" = $1
        AND g."finalGrade" = 2
        AND g."idClass" = $1
    GROUP BY
        s.jmbg, s.firstName, s.lastName
)

SELECT
    COUNT(
        CASE 
            WHEN has_grade_one = 1 THEN 1  -- Student has at least one grade of 1
            ELSE NULL
        END
    ) AS "numNotEnough",  -- Students with at least one grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 4.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numExcellent",  -- Students with average grade above 4.5 and no grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 3.5 AND avg_grade <= 4.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numVeryGood",  -- Students with average grade above 3.5 and up to 4.5 and no grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 2.5 AND avg_grade <= 3.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numGood",  -- Students with average grade above 2.5 and up to 3.5 and no grade of 1
    COUNT(
        CASE 
            WHEN avg_grade > 1.5 AND avg_grade <= 2.5 AND has_grade_one = 0 THEN 1
            ELSE NULL
        END
    ) AS "numEnough",  -- Students with average grade above 1.5 and up to 2.5 and no grade of 1
    COUNT(*) AS "numTotal"  -- Total number of students
FROM
    grade_summary;
`
const results0 = await poolQuery( query0, [req.body.idTeacher, req.body.idSchYear] )
const results = await poolQuery( query, [results0.rows[0].id] )
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during report32', error: error.message });
  }
}
const report4 = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    // const query0 = `SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2;`
    const query1 = `SELECT DISTINCT su.id AS "idSubject", su.name AS name, s."idClass"
                    FROM student s
                    JOIN listens l ON s.jmbg = l.jmbg
                    JOIN subject su ON l."idSubject" = su.id
                    WHERE s."idClass" = (SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2)`
    const query = `
    select  COALESCE((select num from planned_classes where "idSubject" = $1 and "idClass" = $2 and semester = 1),0) as "numPlanned1",
            COALESCE((select num from planned_classes where "idSubject" = $1 and "idClass" = $2 and semester = 2),0) as "numPlanned2",
    (select count(*)
    from w_class wc
    where "idSubject" = $1 and held = true and "idClass" = $2 and
    date between (select "startDate" from school_year where "id" = wc."idSchYear") and
        (select "endOfFirstSem" from school_year where "id" = wc."idSchYear")) as "numHeld1", 
    (select count(*)
    from w_class wc
    where "idSubject" = $1 and held = false and "idClass" = $2 and
    date between (select "startDate" from school_year where "id" = wc."idSchYear") and
        (select "endOfFirstSem" from school_year where "id" = wc."idSchYear")) as "numNotHeld1",
    (select count(*)
    from w_class wc
    where "idSubject" = $1 and held = true and "idClass" = $2 and
    date between (select "startOfSecondSem" from school_year where "id" = wc."idSchYear") and
        (select "endDate" from school_year where "id" = wc."idSchYear")) as "numHeld2", 
    (select count(*)
    from w_class wc
    where "idSubject" = $1 and held = false and "idClass" = $2 and
    date between (select "startOfSecondSem" from school_year where "id" = wc."idSchYear") and
        (select "endDate" from school_year where "id" = wc."idSchYear")) as "numNotHeld2",
    (select count(*)
    from w_class wc
    where "idSubject" = $1 and held = true and "idClass" = $2 and
    date between (select "startDate" from school_year where "id" = wc."idSchYear") and
        (select "endDate" from school_year where "id" = wc."idSchYear")) as "numHeldTot", 
    (select count(*)
    from w_class wc
    where "idSubject" = $1 and held = false and "idClass" = $2 and
    date between (select "startDate" from school_year where "id" = wc."idSchYear") and
        (select "endDate" from school_year where "id" = wc."idSchYear")) as "numNotHeldTot"`

    const results1 = await poolQuery( query1, [req.body.idTeacher, req.body.idSchYear] )
    console.log("results1" + JSON.stringify(results1.rows,null,2))
    let resArray = []
    for (let index = 0; index < results1.rows.length; index++) {
      const element = await poolQuery( query, [results1.rows[index].idSubject, results1.rows[index].idClass] )
      console.log("element" + index + JSON.stringify(element.rows,null,2))
      resArray[index] = { subject: results1.rows[index], classes: element.rows[0]}
      
    }
    
    
    // const results = await poolQuery( query, [req.body.idSubject, req.body.idClass] )
    
    res.status(200).json(resArray)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during report4', error: error.message });
  }
}
const report5 = (req, res) => {
  const query = `WITH class_head_teacher AS (
  SELECT id from class where "idTeacher" = $1 and "idSchYear" = $2
), dates AS (
	SELECT "startDate", "endOfFirstSem", "endDate", "startOfSecondSem" from school_year where id = $2
)
select 
(select count(*) as opravdani1 from missing_student ms join w_class wc on ms."idClass" = wc.id
where jmbg in (select jmbg from class_head_teacher c join student s on c.id = s."idClass")
and "excusedAbsence" = 1 and wc.date between (select "startDate" from dates) and (select "endOfFirstSem" from dates)), 
(select count(*) as opravdani2 from missing_student ms join w_class wc on ms."idClass" = wc.id
where jmbg in (select jmbg from class_head_teacher c join student s on c.id = s."idClass")
and "excusedAbsence" = 1 and wc.date between (select "startOfSecondSem" from dates) and (select "endDate" from dates)),
(select count(*) as neopravdani1 from missing_student ms join w_class wc on ms."idClass" = wc.id
where jmbg in (select jmbg from class_head_teacher c join student s on c.id = s."idClass")
and "excusedAbsence" = 2 and wc.date between (select "startDate" from dates) and (select "endOfFirstSem" from dates)),
(select count(*) as neopravdani2 from missing_student ms join w_class wc on ms."idClass" = wc.id
where jmbg in (select jmbg from class_head_teacher c join student s on c.id = s."idClass")
and "excusedAbsence" = 2 and wc.date between (select "startOfSecondSem" from dates) and (select "endDate" from dates)),

(select count(*) as neobradjeni1 from missing_student ms join w_class wc on ms."idClass" = wc.id
where jmbg in (select jmbg from class_head_teacher c join student s on c.id = s."idClass")
and "excusedAbsence" = 0 and wc.date between (select "startDate" from dates) and (select "endOfFirstSem" from dates)),
(select count(*) as neobradjeni2 from missing_student ms join w_class wc on ms."idClass" = wc.id
where jmbg in (select jmbg from class_head_teacher c join student s on c.id = s."idClass")
and "excusedAbsence" = 0 and wc.date between (select "startOfSecondSem" from dates) and (select "endDate" from dates))`
  const values =  [  req.body.idTeacher , req.body.idSchYear ];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error report5', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const report6 = (req, res) => {
  // list of teachers and subjects that they teach
  // for provided school year
  const query = `with teachers_in_school as (
                  select t.id, firstname, lastname, t.username, subject.id as "idSubject", name 
                  from teacher t join teaches te on t.id = te."idTeacher" join subject ON subject.id = te."idSubject"
                  where subject."idSchYear" = $1
                ), classes_lis as (
                  select distinct c.id, c.year, c.number, c."idTeacher" as "idHeadTeacher", l."idSubject", l."idTeacher"
                  from class c join student s on s."idClass" = c.id join listens l on s.jmbg = l.jmbg 
                  where "idSchYear" = $1 order by c.id
                )
                select distinct t.*, c.id as "idClass", c.year, c.number, c."idHeadTeacher"
                from teachers_in_school t join classes_lis c on t.id = c."idTeacher" and t."idSubject" = c."idSubject"
                order by t.id, t."idSubject", "idClass"`
  const values =  [  req.body.idSchYear ];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error report6', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}



// SETTINGS

const getWeeksInSchYear = (req, res) => {
  const query = `select * from w_week where "idSchYear" = $1 order by number`
  const values =  [  req.body.idSchYear ];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getWeeksInSchYear', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getTeachersSubjectsInSchYear = (req, res) => {
  const query = `select distinct su.*, "idClass", year, number
                from listens l join subject su on l."idSubject" = su.id 
                join student s on l.jmbg = s.jmbg join class c on c.id = s."idClass"
                where su."idSchYear" = $1 and l."idTeacher" = $2`
  const values =  [  req.body.idSchYear , req.body.idTeacher];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getTeachersSubjectsInSchYear', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getClassNums = (req, res) => {
  const query = `select * from planned_classes where "idSubject" = $1 and "idTeacher" = $2 and "idClass" = $3 order by semester`
  const values =  [ req.body.idSubject, req.body.idTeacher, req.body.idClass];
  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error getClassNums', error: error });
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const setClassNums = async (req, res) => {
  const poolQuery = (query, values) => new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

  try {
    const query = `WITH updated AS (
                    UPDATE planned_classes SET num = $1
                    WHERE "idSubject"= $2 and "idTeacher" = $3 and "idClass" = $4 and semester = $5
                    RETURNING *
                  )
                  INSERT INTO planned_classes ("num", "idSubject", "idTeacher", "idClass", "semester")
                  SELECT $1, $2, $3, $4, $5
                  WHERE NOT EXISTS (SELECT 1 FROM updated);`
    // console.log(JSON.stringify(req.body.numbers, null, 2))

    for (let index = 0; index < req.body.numbers.length; index++) {
      const element = req.body.numbers[index];
      await poolQuery( query, [Number(element), req.body.idSubject, req.body.idTeacher, req.body.idClass, (index+1)] )
    }
    //const results = await poolQuery( query, values )
      
    //res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during setClassNums', error: error.message });
  }
}


module.exports = {getTeachers, getSchools, login, getAllSchools, setEndDateOfFirstSem, setStartDateOfSecondSem, 
  getSchYearsForSchoolAndTeacher, getClassesThatTeacherTeaches, getSubjectsThatTeacherTeachesToThatClass,
  getWDay, toggleTeachingDay, insertClass, getClassTypes, findClassesForDate, findPreviousLesson, classNumInDateExists, getStudentsInClass,
  getWeeksAndDays, getStudentsInClassListensSubj, deleteMissStudAndWclass, insertNotHeldClass, updateNote, getMissStudFromPreviousClass,
  getGradingType, getGradeTypes, checkDateAndWClass, insertGrade, getStudGrades, averageGradeYear,getSchoolAndSchoolYear, getClassesAndHeadTeacher, 
  setEndOfFirstQ, setEndOfThirdQ, getDatesInYearForClass, averageGradeSem1, averageGradeSem2, sendDeletionReq, getDeletionReq, deleteGrade,
  updateGrade, getStudentsInClassOrder, getMonitorsForClass, hasMonitors, studentsAbsences, studentsAbsencesStatusChange, studentsNoG,
  addDisciplinaryMeasure, getDisciplinaryMeasures, updateStudentsInfo, getHeadTeacher, getSubjectsAndTeachersForStudent,
  getGradingTypeForAddingSubj, getTeachersThatTeachesSubj, getSubjectsInSchYear, getAllGradingTypes, insertIntoListens, insertIntoSubjGradType, deleteFromListens,
  // reports
  isHeadTeacher, getSuccess, getAllGrades, report1, report2, report31, report32, report4, report5,report6,
  // settings
  getWeeksInSchYear, getTeachersSubjectsInSchYear , getClassNums, setClassNums
}