namespace Perfmormance_Cat_Shelter.Models
{
    public class Available
    {
        public int ID { get; set; }

        public DateTime?Date_Adopted { get; set; }
        
        public DateTime Date_Rescued { get; set; }

        public int Price { get; set; }
    }
}