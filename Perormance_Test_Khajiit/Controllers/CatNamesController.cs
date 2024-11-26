using Microsoft.AspNetCore.Mvc;
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

                            Cat_Name = (string)reader["Cat_Name"],

                            BreedID = (int)reader["BreedID"],

                            AdotpedID = (int)reader["AdoptID"]

                        });
                    }
                }
            }
            


            return Names;

        }
    }

}

