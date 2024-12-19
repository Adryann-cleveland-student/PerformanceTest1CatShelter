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

                        });
                    }
                }
            }



            return Available;

        }
    
        [HttpPost]
        public IActionResult Post(Available available)
        {
            // Validate incoming data
            if (available == null || available.Date_Rescued == DateTime.MinValue)
            {
                return BadRequest("Invalid data provided.");
            }

            // SQL query
            const string commandText = "INSERT INTO Cat_Available (Date_Adopted, Date_Rescued, Price) VALUES (@Date_Adopted, @Date_Rescued, @Price)";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.AddWithValue("@Date_Adopted", available.Date_Adopted ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Date_Rescued", available.Date_Rescued);
                    command.Parameters.AddWithValue("@Price", available.Price);

                    try
                    {
                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return BadRequest("Event not added.");
                        }
                        return Ok(available);
                    }
                    catch (SqlException ex)
                    {
                        // Log error (consider using a logger)
                        return StatusCode(500, $"Database error: {ex.Message}");
                    }
                }
            }
        }
        [HttpPut("{id}")]
        public IActionResult Put(int id, Available available)
        {
            const string UpdateCommand = @"UPDATE Cat_Available SET Date_Adopted = @Date_Adopted, Price = @Price WHERE ID = @ID";

            using (SqlConnection conn = new SqlConnection(_configuration))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand(UpdateCommand, conn))
                {
                    command.Parameters.AddWithValue("@ID", id);
                    command.Parameters.AddWithValue("@Date_Adopted", available.Date_Adopted.HasValue ? available.Date_Adopted.Value : (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Price", available.Price);

                    int rowsAffected = command.ExecuteNonQuery();
                    if (rowsAffected == 0)
                    {
                        return NotFound("Record not found for update.");
                    }

                    return Ok("Record updated successfully.");
                }
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            const string query = "DELETE FROM Cat_Available WHERE ID = @ID";
            using (SqlConnection connection = new SqlConnection(_configuration))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ID", id);

                    int rowsAffected = command.ExecuteNonQuery();
                    if (rowsAffected == 0)
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
