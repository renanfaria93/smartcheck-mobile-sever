// services/activityService.js

const Activity = require("../models/activityModel");

class ActivityService {
  //Método para buscar tarefas
  static async getActivitys() {
    return await Activity.getActivitys();
  }
}

module.exports = ActivityService;
