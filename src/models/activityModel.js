const { supabase } = require("../network/supabaseClient");

class Activity {
  constructor(label) {
    this.label = label;
  }

  // Método estático para buscar as atividades
  static async getActivitys() {
    const { data, error } = await supabase.from("activitys").select("*");

    if (error) {
      throw new Error("Erro ao buscar a lista de atividades: " + error.message);
    }

    return data;
  }
}

module.exports = Activity;
