import ServiceCard from "../components/ServiceCard"
import { services } from "../data/services"

function Services(){

return(

<section className="services">

<h2>

Our Services

</h2>

<div className="cards">

{

services.map((service)=>(

<ServiceCard

key={service.id}
service={service}

/>

))

}

</div>

</section>

)

}

export default Services