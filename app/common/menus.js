/**
 * Created by Frank on 15/6/12.
 */
module.exports = {
    schoolMenus: {
        home: {active: '0'},
        teacherManager: {active: '1'},
        classManager: {active: '2'},
        studentManager: {active: '3'},
        score: {
            ruleManager: {
                active: '4-0'
            },
            instruction: {
                active: '4-1'
            }
        },
        scoreMall: {
            active: '5'
        },
        schedule: {
            active: '6'
        },
        quizzes: {
            active: '7'
        },
        weixin:{
            materialsManager:{
                active:'9-0'
            }
        }
    },
    teacherMenus: {
        home: {active: '0'},
        homework: {
            create: {active: '1-0'},
            list: {active: '1-1'},
            history: {
                active: '1-2'
            }
        },
        preview: {
            create: {active: '2-0'},
            list: {active: '2-1'},
            history: {
                active: '2-2'
            }
        },
        classManager: {active: '3'},
        studentManager: {active: '4'},
        schedule: {
            active: '6'
        },
        quizzes: {
            active: '5'
        },
        connection: {
            active: '7'
        }
    }
};