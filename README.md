# inCNV

inCNV is a web-based application being efficient to accept multiple CNV-tool results as input, integrate and prioritize captured CNVs with user-friendly interface. It can help users analyze the importance of captured CNVs by annotating CNVs with genetic data from Ensembl, Database of Genomic Variants (DGV), ClinVar and Online Mendelian Inheritance in Man (OMIM). Moreover, users can select interesting CNVs and export them as a plain text format to do further experimentally bio wet lab.

inCNV devide analyses into 2 categories: (1) Individual sample analysis, (2) Multiple sample analysis

- Individual sample analysis: It focuses on finding the more precise CNVs by integrating the results of multiple CNV detector tools on one sample.
- Multiple sample analysis: It focuses on finding the more precise CNVs by integrating the CNV results of multiple samples identified by a CNV tool.

## Impementation

inCNV was designed as a three-layer architecture with the (1) Frontend, (2) Backend, and (3) Database.

- **Frontend:**
  The frontend was developed by Angular framework (version 9.0.0).
  For UI, inCNV used Angular material UI component library (version 9.0.0) and d3.js library (version 5.14.2). The current version of inCNV supports Chrome, Opera, and Safari browsers.
- **Backend:**
  We used Node.js with typescript and express framework for the backend development. Moreover, the backend was adopted with some extension for reading FASTA file with indexedfasta-js package (version 1.0.12) from JBrowse.26
- **Database:**
  We used MySql as our DBMS. We have 3 schemas (or databases) namely, inCNV, bio_grch37, bio_grch38.
  - 'inCNV schema' will stored user information and uploaded CNV result files.
  - 'bio_grch37 schema' will store annotations for reference genome GRCh37.
  - 'bio_grch38 schema' will store annotations for reference genome GRCh38.

## Installation

Use the [docker](https://docs.docker.com) to install inCNV.

```
docker-compose up -d
```

- **Installation:**
  The installed inCNV on the localhost will then automatically send a request to get the data sources provided at https://github.com/saowwapark/inCNV-datasource in order to configure the initial database and other data sources of the system.
- **Updating annotations:**  
  inCNV will automatically update annotation databases provided at https://github.com/saowwapark/inCNV-datasource. inCNV will update only 'bio_grch37' and 'bio_grch38' schemas. For inCNV schema which stores uploaded CNV result files, inCNV will keep it the same.
- **Updating new version of inCNV:**
  the data stored in databases will be kept the same.
- **Uninstallation:**
  Users have to normally remove dockers and manually remove databases.

## How to configure

Users can confiugre environments, by editing at file 'docker-compose.yml' attached to this project. Some part of file shown below;

```
  incnv-backend:
    image: saowwapark/incnv-backend:latest
    container_name: incnv-backend
    restart: always
    environment:
      - NODE_ENV=development
      - PORT=3000
      - HOST=0.0.0.0
      - DB_HOST=incnv-db
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - UPDATE_BIO_DATA_SCHEDULE="0 0 * * *" // cron job
    networks:
      - incnv-network
    volumes:
      - incnv-backend-volume:/usr/src/app/src/datasource/
    depends_on:
      incnv-db:
        condition: service_healthy
```

From code above, inCNV configuration has details;

- Users can change every fields in environment setting except for 'NODE_ENV' and 'HOST'.
- The code above is only partial. Therefore, after editing environment section, users have to edit other part of 'docker-componse.yml' related to the edited environment.
- The database can be remotely accessed from outside the docker both within the same host and other hosts via TCP/IP. This feature is used to users can manually query data from a visual database design tool such as Workbech. Therefore, we recommend users to change 'DB_USER' and 'DB_PASSWORD'.
- 'UPDATE_BIO_DATA_SCHEDULE' stores cron job data to be used for updating annotation databases. -- see information about [cron job](https://en.wikipedia.org/wiki/Cron).

## Work flow

inCNV has data flow diagram (DFD) as below;
// DFD chart

## Input data preparation

### Uploaded files

Before using inCNV, users have to upload CNV results from any CNV detector tool that matches with the ‘CNV tool mapping’ and ‘sample set’ which need to be configured by the users before their upload.
// input file example
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/upload_file.png)

- The format of input file has to be tab-delimitted format.
- The file has to at least 5 columns represeting data: sample name, chromosome, start basepair, end basepair and cnv type.

### File mapping

The ‘CNV tool mapping’ allows users to define input file formats, which will be used to map with the CNV results generated from any CNV detector tools. Hence, inCNV can understand the CNV result file from any tools.
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/file_mapping.png)

- **Header column mapping:** mapping column of any result file. Users have to configure column name with the criteria: 'SAMPLE NAME', 'CHROMOSOME', 'START BASE PAIR', 'END BASE PAIR', and 'CNV TYPE'. For example, if a result file represents sample name with 'sample', we will set 'SAMPLE NAME' is with 'sample'. If a result file represents chromosome with 'chr', we will set 'CHROMOSOME' with 'chr'.
- **Data field mapping:** mapping data of result file. Users have to configure data with the criteria: 'CHROMOSOME22', 'DUPLICATION', and 'DELETION'. For example, if a result file represents chromosome 22 with '22', we will set 'CHROMOSOME22' with '22'. If a result file represents duplication type of CNV with 'dup', we will set 'DUPLICATION' with 'dup'.

### Sample set

The ‘sample set’ allows users to define a group of samples they are interested in. At this component, users can indicate a set name, description and sample names of any sample set.

![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/sample_set.png)

- The sample names have to match with data in 'SAMPLE NAME' column of the given result file.

## Analysis configuration

Users have to choose interesting criteria to analyze.

- **For individaul sample analysis:** criteria namely a reference genome, a sample set, a sample name, many files, a CNV type and a chromosome.
  ![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/individual_configure.png)

- **multiple sample analysis:** criteria namely a reference genome, a sample set, many sample names, one file, a CNV type and a chromosome.
  // image

## Integreated CNV analyses

inCNV devides analyses into 2 categories: (1) Individual sample analysis, (2) Multiple sample analysis
use case

### Individual sample analysis

- finding the more precise CNVs by integrating the results of multiple CNV detector tools on one sample.
- finding CNVs not previously reported in case inCNV provides common overlapping CNVs but not match with DGV.
- providing the CNV flanking region extraction which will extract the left and right flanking sequences of the CNV that can be used by biologists for primer design.

![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/individual_sample_analysis.png)

### Multiple sample analysis

- finding the more precise CNVs by integrating the CNV results of multiple samples identified by a CNV tool.
- finding the relationship between the given group of samples having the same disease.
- finding rare CNVs of samples from the same family or of the given sample set.
  - To do this, users can filter out the common CNVs and explore whether the remaining CNVs are rare and associated with the disease or not
- finding a targeted sample is potential to have a specific disease. This can be done by

  1. combining CNV results of our target with the results and of a sample set which having the same disease.
  2. searching genes related to specific disease.
  3. searching our target
  4. searching the most common overlapping samples that include our target (our interesting sample).
  5. Then, if we can find enough the number of overlapping CNVs including our target’s CNVs, we may predict that the target is potential to have a disease and we need to perform biological wet lap to confirm again.

  ![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/multiple_sample_analysis.png)
