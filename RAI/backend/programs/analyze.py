from mpi4py import MPI
import pymongo

def calculateQuality(qualities):
    # ce se slaba cesta ponovi veckrat zapored, povecamo utez
    quality = 0
    last = qualities[0]
    allsum = 0
    w = 1;
    for q in qualities:
        if last == q:
            w = 1.1
        allsum = allsum + q*w

    return allsum/(len(qualities))



comm = MPI.COMM_WORLD
rank = comm.Get_rank()


if(rank == 0):
    # povežemo se s podatkovno bazo
    client = pymongo.MongoClient("mongodb+srv://alen:geslo@cluster0.y1dtg.mongodb.net/Routek?ssl=true&ssl_cert_reqs=CERT_NONE")
    database = client.Routek
    mycollection = database.roads

    # pridobimo vse podatke o cestah
    road_data = list(mycollection.find())

    # razdelimo podatke
    qualities = []
    for i in range(1, 4):
        for j in range( len(road_data) // 3):
            qualities.append(road_data[i*j]["quality"])
        if(i == 3):
            for k in range( len(road_data) - len(road_data) % 3,  len(road_data)):
                qualities.append(road_data[k]["quality"])

        comm.send(qualities, dest=i)
        qualities.clear()

    # pridobimo podatke, jih seštejemo in delimo s 3
    allquality = 0
    for i in range(1, 4):
        allquality = allquality + comm.recv(source=i)

    print(allquality/3.0)

if(rank == 1 or rank == 2 or rank == 3):
    qualities = comm.recv(source=0)
    q = calculateQuality(qualities)

    comm.send(q, dest=0)
