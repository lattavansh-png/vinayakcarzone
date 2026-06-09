function ServiceCard({service}){

return(

<div className="card">

<img
src={service.image}
alt={service.title}
/>

<h3>

{service.title}

</h3>

<p>

{service.description}

</p>

<button>

BOOK SERVICE

</button>

</div>

)

}

export default ServiceCard