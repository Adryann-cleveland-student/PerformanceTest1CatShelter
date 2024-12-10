using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Perfmormance_Cat_Shelter.Models;

using System.Data.SqlClient;

namespace Perfmormance_Cat_Shelter.Controllers
{
    [Route("api/Names")]
    [ApiController]
    public class CatNamesController : ControllerBase
    {
        private readonly string _configuration;

        public CatNamesController(IConfiguration configuration)
        {
            _configuration = configuration.GetConnectionString("ctc_dev_DBConnection");

        }

        [HttpGet(Name = "GetNames")]

        public IEnumerable<Names> Get()
        {
            var Names = new List<Names>();


            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT * FROM Cat_Names", connection))
                {
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        Names.Add(new Names
                        {
                            ID = (int)reader["ID"],

                            Cat_Name = (string)reader["Cat_Name"],

                            BreedID = (int)reader["BreedID"],

                            Date_AdotpedID = (int)reader["Date_AdoptedID"]

                        });
                    }
                }
            }



            return Names;

        }


        [HttpPost("api/Names")]
        public IActionResult Post(Names names)
        {
           const string commandText = "INSERT INTO Cat_Names(Cat_Name ,BreedID, Date_AdoptedID) VALUES (@Cat_Name, @BreedID, @Date_AdoptedID)";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
            connection.Open();
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.AddWithValue("@Cat_Name", names.Cat_Name);
                    command.Parameters.AddWithValue("@BreedID", names.BreedID);
                    command.Parameters.AddWithValue("@Date_AdoptedID", names.Date_AdotpedID);

                    int CatNameADD = command.ExecuteNonQuery();
                    if (CatNameADD == null) 
                    {
                    return BadRequest("Event not added");
                    }

                    return CreatedAtRoute("GetNames", new { ID = names.Cat_Name },names);
                }
            }

        }

        [HttpPut(Name = "UpdateCatNames")]
        public IActionResult Put(Names names) 
        {
            string UpdateCommand = "UPDATE Cat_Names SET Cat_Name ='@Cat_Name', BreedID = '@BreedID', Date_AdoptedID = '@Date_AdoptedID' WHERE ID = @ID";
            using (SqlConnection conn = new SqlConnection(_configuration))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand(UpdateCommand, conn))
                {
                    command.Parameters.AddWithValue("@ID", names.ID);
                    command.Parameters.AddWithValue("@Cat_Name", names.Cat_Name);
                    command.Parameters.AddWithValue("@BreedID", names.BreedID);
                    command.Parameters.AddWithValue("@Date_AdoptedID", names.Date_AdotpedID);

                    int Update = command.ExecuteNonQuery();
                    if(Update == null) 
                    { return BadRequest("Failed Update");
                    }
                    return Ok("Updated");
                }
            }
        }

        [HttpDelete(Name = "DeleteCatName")]
        public IActionResult Delete(Names names) 
        { 
        string DeleteCommand = "DELETE FROM Cat_Names WHERE ID = @ID";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
connection.Open();

                using(SqlCommand command = new SqlCommand(DeleteCommand, connection))
                {
                    command.Parameters.AddWithValue("@ID", names.ID);

                    int DeleteRows = command.ExecuteNonQuery();
                    if (DeleteRows == null) { return BadRequest("Failed Request"); }
                    return Ok("Deleted");
                }
            }
        }
    }

}