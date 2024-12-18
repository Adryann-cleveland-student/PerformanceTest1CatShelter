using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Perfmormance_Cat_Shelter.Models;
using System.Data.SqlClient;

namespace Perfmormance_Cat_Shelter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatAvailableController : ControllerBase
    {
        private readonly string _configuration;

        public CatAvailableController(IConfiguration configuration)
        {
            _configuration = configuration.GetConnectionString("ctc_dev_DBConnection");

        }

        [HttpGet(Name = "GetAvailable")]

        public IEnumerable<Available> Get()
        {
            var Available = new List<Available>();


            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT * FROM Cat_Available", connection))
                {
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        Available.Add(new Available
                        {

                            ID = (int)reader["ID"],

                            Date_Adopted = Convert.IsDBNull(reader["Date_Adopted"]) ? null : (DateTime?)reader["Date_Adopted"],

                            Date_Rescued = (DateTime)reader["Date_Rescued"],

                            Price = (int)reader["Price"]

                        }) ;
                    }
                }
            }



            return Available;

        }
        [HttpPost]
        public IActionResult Post(Available available)
        {
            const string commandText = "INSERT INTO Cat_Available(Date_Adopted ,Date_Rescued, Price) VALUES (@Date_Adopted, @Date_Rescued, @Price)";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    
                    command.Parameters.AddWithValue("@Date_Adopted", available.Date_Adopted ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Date_Rescued", available.Date_Rescued);
                    command.Parameters.AddWithValue("@Price", available.Price);


                    int CatNameADD = command.ExecuteNonQuery();
                    if (CatNameADD == 0)
                    {
                        return BadRequest("Event not added");
                    }

                    return CreatedAtRoute("GetBreeds", new { ID = available.Date_Rescued }, available);
                }
            }

        }
        [HttpPut]
        public IActionResult Put(Available available)
        {
            string UpdateCommand = "UPDATE Cat_Available SET Date_Adopted ='@Date_Adopted',Date_Rescued ='@Date_Rescued',Price ='@Price'WHERE ID = @ID";
            using (SqlConnection conn = new SqlConnection(_configuration))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand(UpdateCommand, conn))
                {
                    command.Parameters.AddWithValue("@ID", available.ID);
                    command.Parameters.AddWithValue("@Date_Adopted", available.Date_Adopted);
                    command.Parameters.AddWithValue("@Date_Rescued", available.Date_Rescued);
                    command.Parameters.AddWithValue("@Price", available.Price);

                    int Update = command.ExecuteNonQuery();
                    if (Update == 0)
                    {
                        return BadRequest("Failed Update");
                    }
                    return Ok("Updated");
                }
            }
        }

        [HttpDelete]
        public IActionResult Delete(Available available)
        {
            const string query = "DELETE FROM Cat_Breeds WHERE ID = @ID";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ID", available.ID);

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