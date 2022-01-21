const db = require("../../data/db-config")

function find() {
  return db
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .from('schemes as sc ')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
}

function findById(scheme_id) {
  const schemeID = Number(scheme_id)
  return db
    .select('sc.scheme_name', 'st.*')
    .from('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', schemeID)
    .orderBy('st.step_number')
    .then((steps) => {
      if(steps[0].step_id === null) {
        const schemeSteps = {
          'scheme_id': schemeID,
          'scheme_name': steps[0].scheme_name,
          'steps': []
        }
        return schemeSteps
      } else {
        const schemeSteps = {
          'scheme_id': schemeID,
          'scheme_name': steps[0].scheme_name,
          'steps': steps.map(step => {
            return {
              "step_id": step.step_id,
              "step_number": step.step_number,
              "instructions": step.instructions
            }
          })
        }
        return schemeSteps
        
      }
      
    })
}

function findSteps(scheme_id) {
  return db
    .select('st.step_id','st.step_number','st.instructions','sc.scheme_name')
    .from('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_id', "desc")
    .then(steps => {
      if (steps[0].step_number === null) {
        return [];
      } else {
        return steps;
      }
    })
}

function add(scheme) {
  return db('schemes')
    .insert({ scheme_name: scheme.scheme_name })
    .then(id => {
      return db('schemes')
      .where("scheme_id",id)
      .first()
    })
}

function addStep(scheme_id, step) {
  return db('steps')
    .insert({
      step_number: step.step_number,
      instructions: step.instructions,
      scheme_id: scheme_id
    })
    .then(id => {
      return findSteps(scheme_id)
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
