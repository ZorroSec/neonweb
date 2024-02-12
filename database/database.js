const mysql = require("mysql2")

module.exports = {
  MySqlConnection: ()=>{
    const connection = mysql.createPool({
      uri: "mysql://railway:IAbtKDpHX5~2B-eev_SegOo9Clmf2RxT@monorail.proxy.rlwy.net:46278/railway"
    })
    const pool = connection.promise()
    return pool
  }
}