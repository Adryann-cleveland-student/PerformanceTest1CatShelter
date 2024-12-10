using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Perfmormance_Cat_Shelter.Models;
using System;
using System.Data.SqlClient;
using System.Xml.Linq;

namespace Perfmormance_Cat_Shelter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatBreedsController : ControllerBase
    {
        private readonly string _configuration;

        public CatBreedsController(IConfiguration configuration)
        {
            _configuration = configuration.GetConnectionString("ctc_dev_DBConnection");

        }

        [HttpGet(Name = "GetBreeds")]

        public IEnumerable<Breeds> Get()
        {
            var breeds = new List<Breeds>();


            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT * FROM Cat_Breeds", connection))
                {
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        breeds.Add(new Breeds
                        {

                            ID = (int)reader["ID"],

                            Breed = (string)reader["Breed"],

                            Age = (int)reader["Age"],

                            Size = (string)reader["Size"]

                        });
                    }
                }
            }
            return breeds;
        }
        [HttpPost]
        public IActionResult Post(Breeds breeds)
        {
            const string commandText = "INSERT INTO Cat_Breeds(Breed ,Age, Size) VALUES (@Breed, @Age, @Size)";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.AddWithValue("@ID", breeds.ID);
                    command.Parameters.AddWithValue("@Breed", breeds.Breed);
                    command.Parameters.AddWithValue("@Age", breeds.Age);
                    command.Parameters.AddWithValue("@Size", breeds.Size);

                    int CatNameADD = command.ExecuteNonQuery();
                    if (CatNameADD == null)
                    {
                        return BadRequest("Event not added");
                    }

                    return CreatedAtRoute("GetBreeds", new { ID = breeds.Breed }, breeds);
                }
            }

        }
        [HttpPut]
        public IActionResult Put(Breeds breeds)
        {
            string UpdateCommand = "UPDATE Cat_Breeds SET Breed = '@Breed', Age = '@Age', Size = '@Size' WHERE ID = @ID";
            using (SqlConnection conn = new SqlConnection(_configuration))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand(UpdateCommand, conn))
                {
                    command.Parameters.AddWithValue("@ID",breeds.ID );
                    command.Parameters.AddWithValue("@Breed",breeds.Breed );
                    command.Parameters.AddWithValue("@Age",breeds.Age);
                    command.Parameters.AddWithValue("@Size",breeds.Size);

                    int Update = command.ExecuteNonQuery();
                    if (Update == null)
                    {
                        return BadRequest("Failed Update");
                    }
                    return Ok("Updated");
                }
            }
        }

        [HttpDelete]
        public IActionResult Delete(Breeds breeds)
        {
            const string query = "DELETE FROM Cat_Breeds WHERE ID = @ID";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ID", breeds.ID);

                    int rowsAffected = command.ExecuteNonQuery();
                    if (rowsAffected == null)
                    {
                        return BadRequest();
                    }
                    else

                        return Ok("Record found.");

                }
            }

        }
    }


}