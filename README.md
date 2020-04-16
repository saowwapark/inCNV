# inCNV

inCNV is a web-based application accepting multiple CNV-tool results as input, integrate and prioritize captured CNVs with user-friendly interface. It can help users analyze the importance of captured CNVs by annotating CNVs with genetic data from Ensembl, Database of Genomic Variants (DGV), ClinVar and Online Mendelian Inheritance in Man (OMIM) including their flanking sequences. Moreover, users can select interesting CNVs and export them as a plain text format to do further experimentally bio wet lab.

inCNV devide analyses into 2 modules: (1) Individual sample analysis, (2) Multiple sample analysis

- Individual sample analysis: It focuses on finding the more precise CNVs by integrating the results of multiple CNV detector tools on one sample.
- Multiple sample analysis: It focuses on finding the more precise CNVs by integrating the CNV results of multiple samples identified by a CNV tool.

## Impementation

inCNV was designed as a three-layer architecture with the (1) Frontend, (2) Backend, and (3) Database.

- **Frontend:**
  The frontend was developed by Angular framework (version 9.0.0).
  For UI, inCNV used Angular material UI component library (version 9.0.0) and d3.js library (version 5.14.2). The current version of inCNV supports Chrome, Opera, and Safari browsers.
- **Backend:**
  We used Node.js with typescript and express framework for the backend development. Moreover, the backend was adopted with some extension for reading FASTA file with _indexedfasta-js_ package (version 1.0.12) from JBrowse[2].
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
  The installed inCNV on the localhost will automatically send a request to get the data sources provided at https://github.com/saowwapark/inCNV-datasource in order to generate initial databases and other data sources of the system.
- **Updating annotations:**  
  After [inCNV-datasource](https://github.com/saowwapark/inCNV-datasource) releases the new version, inCNV will automatically dowloand them and update annotation databases in the system. inCNV will update only 'bio_grch37' and 'bio_grch38' schemas. For inCNV schema which stores uploaded CNV result files, inCNV will keep it the same.
- **Updating new version of inCNV:**
  The data stored in databases will remain the same. inCNV will update database only when new version of datasource is released.
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

## Demo

Users can download demo input files provided at [demo](https://github.com/saowwapark/inCNV/tree/master/demo-data).

We modified the results files from _Zare, F. et al._[1] before uploading them into inCNV. We filtered out the data which not needing for inCNV analysis and reformat the remain data to match with a [pre-defined CNV tool template](#file-mapping).

The files were obtained from running multiple CNV detection tools against the exome of ten patients with breast cancer from the cancer genome atlas (TCGA)25 with BRCA project. The tools used for detecting CNVs were ADTEx, cn.MOPS, CONTRA, ExomeCNV31 and VarScan2. According to _Zare, F. et al._[1], Those tools have the thresholds of +/-0.2 to call CNVs.

The result files from ADTEx, cn.MOPS and ExomeCNV represents CNV type with a standard CNV type number. The ‘1’, ‘2’, and ‘3’ represents the CNV deletion, no CNV (normal), and CNV duplication, respectively. The type number with more than ‘3’ represents the amplification. For our data sets, we used number ‘1’ as CNV deletion and number ‘3’ and more as CNV duplication.
The result files from CONTRA and VarScan2 represent CNV type with log2 ratio. Therefore, for our data sets, we used log-ratio > +0.2 as the criteria for CNV duplication and log-ratio < - 0.2 for CNV deletion.

## Work flow

inCNV has data flow diagram (DFD) as below;
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/overall_architecture.png)

## Input data preparation

### Uploaded files

Before using inCNV, users have to upload CNV results from any CNV detector tool that matches with the pre-defined [CNV tool mapping](#file-mapping) and pre-defined [sample set](#sample-set).\

_Example: some part of CNV detection tool named CONTRA_

```
sample	chr	start	end	cnv_type
TCGA-A7-A0CE	1	11868	14412	del
TCGA-A7-A0CE	1	14362	29806	del
TCGA-A7-A0CE	1	29553	33264	del
TCGA-A7-A0CE	1	30266	31109	del
TCGA-A7-A0CE	1	30365	30503	del
TCGA-A7-A0CE	1	36276	50281	dup
TCGA-A7-A0CE	1	69090	70008	del
TCGA-A7-A0CE	1	129080	134836	del
```

_Upload component_
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/upload_file.png)

The CNV result files have to be plain text with tab-delimitted format. The contents need to have at least 5 columns which having the meanings of sample name, chromosome, start base pair, end base pair and CNV type.

### File mapping

The ‘CNV tool mapping’ allows users to define input file formats, which will be used to map with the CNV results generated from any CNV detector tools. Users, however, need to reformat the result files to match with inCNV file template described below so that inCNV can understand the files.  
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/file_mapping.png)

- **Header column mapping:** The header columns consist of 'SAMPLE NAME', 'CHROMOSOME', 'START BASE PAIR', 'END BASE PAIR', and 'CNV TYPE'. Users have to map column of any result file to them. For example, if a result file represents sample name with 'sample', we will set 'SAMPLE NAME' with 'sample'. If a result file represents chromosome with 'chr', we will set 'CHROMOSOME' with 'chr'.
- **Data field mapping:** The data fields needed to be mapped consist of 'CHROMOSOME22', 'DUPLICATION', and 'DELETION'. Users have to map content of any result file to them. For example, if a result file represents chromosome 22 with '22', we will set 'CHROMOSOME22' with '22'. If a result file represents duplication type of CNV with 'dup', we will set 'DUPLICATION' with 'dup'.\
  _Note: For duplication CNV type, inCNV can understand only the words: 'dup', 'duplication' and 'gain'. For deletion CNV type, inCNV can understand only the words: 'del', 'deletion' and 'loss'._

### Sample set

The ‘sample set’ allows users to define a group of samples they are interested in. At this component, users can indicate a set name, description and sample names of any sample set.

![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/sample_set.png)

- The sample names have to match with data in 'SAMPLE NAME' column of the given result file.

## Analysis configuration

Users have to choose interesting criteria to analyze.

- **individaul sample analysis:** criteria namely a reference genome, a sample set, a sample name, many files, a CNV type and a chromosome.
  ![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/individual_configure.png)

- **multiple sample analysis:** criteria namely a reference genome, a sample set, many sample names, one file, a CNV type and a chromosome.

## Integreated CNV analyses

inCNV devides analyses into 2 modules: (1) Individual sample analysis, (2) Multiple sample analysis
use case

### Individual sample analysis

In this module, inCNV can help:

- finding the more precise CNVs by integrating the results of multiple CNV detector tools on one sample.
- finding CNVs not previously reported in case inCNV provides common overlapping CNVs but not match with DGV.
- providing the CNV flanking region extraction which will extract the left and right flanking sequences of the CNV that can be used by biologists for primer design.\
  _Example_
  ![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/individual_sample_analysis.png)

Moreover, when users hover or click at any charts, they will show pop-up dialog data belows;\
_CNV Tool dialog showing inputted-file CNV_
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/individual_cnv_tool_dialog.png)

_merged CNV dialog showing integrated CNV_
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/individual_merged_dialog.png)

_selected CNV dialog showing chosen CNV to export_
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/individual_selected_dialog.png)

### Multiple sample analysis

In this module, inCNV can help:

- finding the more precise CNVs by integrating the CNV results of multiple samples identified by a CNV tool.
- finding the relationship between the given group of samples having the same disease.
- finding common CNVs within a group of samples having the same disease or de novo CNVs of a sample with in the same family or of the given sample set.
  - To do this, users can filter out the common CNVs and explore whether the remaining CNVs are unique for a specific sample and/or associated with the disease
- finding a targeted sample is potential to have a specific disease. This can be done by

  1. combining CNV results of our target with the results and of a sample set which having the same disease.
  2. searching genes related to specific disease.
  3. searching our target
  4. searching the most common overlapping samples that include our target (our interesting sample).
  5. Then, if we can find enough the number of overlapping CNVs including our target’s CNVs, we may predict that the target is potential to have a disease and we need to perform biological wet lap to confirm again.

_Example_
![Image](https://github.com/saowwapark/inCNV/blob/master/demo-images/multiple_sample_analysis.png)

Moreover, when users hover or click at any chart, they will pop-up dialog like the way in Individual sample analysis

## References

<a id="1">[1]</a>
Zare F, Dow M, Monteleone N, Hosny A, Nabavi S. An evaluation of copy number variation detection tools for cancer using whole exome sequencing data. Bmc Bioinformatics. 2017;18(1):286.\
<a id="2">[2]</a>
Buels R, Yao E, Diesh CM, et al. JBrowse: a dynamic web platform for genome visualization and analysis. Genome Biol. 2016;17:66.
