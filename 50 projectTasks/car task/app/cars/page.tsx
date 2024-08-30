import { fetchCars } from "@utils";
import { HomeProps } from "@types";
import { fuels, yearsOfProduction } from "@constants";
import { CarCard, ShowMore, SearchBar, CustomFilter } from "@components";

export default async function page({ searchParams }: HomeProps) {
  const allCars = await fetchCars({
    /*search params */
    manufacturer: searchParams.manufacturer ?? "",
    year: searchParams.year ?? 2022,
    fuel: searchParams.fuel ?? "",
    limit: searchParams.limit ?? 10,
    model: searchParams.model ?? "",
  });
  /*check data empty*/
  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car ShowCase</h1>
          <p>search cars you may like</p>
        </div>

        <div className="home__filters">
          {/* search for car models */}
          <SearchBar />
          {/* select for fuel type and years */}
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} key={car.id} />
              ))}
            </div>
            {/* displaying 10 cars again */}
            <ShowMore
              pageNumber={(searchParams.limit ?? 10) / 10}
              isNext={(searchParams.limit ?? 10) > allCars.length}
            />
          </section>
        ) : (
          <div className="home__error-container">
            {/* showing error if there is no data */}
            <h2 className="text-black text-xl font-bold"> no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
