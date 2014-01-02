"""
Installer for KBase narrative Python libraries
"""
import glob
import os
import re
import sys
import ez_setup
ez_setup.use_setuptools()
from setuptools import setup, find_packages
# added command classes
from biokbase.narrative.common.util import BuildDocumentation

# Parse "long" description from the README
readme_text = open("README.md").read()
m = re.search("##\s*Description\s*([^#]+)", readme_text, flags=re.M)
if not m:
    print("Error getting description from README.md")
    sys.exit(1)
long_desc = m.groups()[0].strip()


def create_run_notebook_script(target_dir="/", profile="narrative"):
    _op = os.path
    script = "kbase_notebook"
    
    # working dir is directory of this script
    work_dir = _op.dirname(_op.realpath(__file__))
    # venv_dir is where the user's virtual env is located
    venv_dir = os.environ['VIRTUAL_ENV']

    # Load template.
    tmpl_text = open(_op.join(work_dir, script + ".tmpl")).read()

    # Write script.
    script_text = tmpl_text.format(venv_dir=venv_dir, cur_dir=work_dir, profile=profile)
    script_file = _op.join(target_dir, script)
    open(script_file, "w").write(script_text)
    os.chmod(script_file, 0755)

    print("Wrote {}".format(script_file))
    
if "install" in sys.argv:
    opath = os.path.join(os.environ['VIRTUAL_ENV'], "bin")
    create_run_notebook_script(target_dir=opath)
    

# Do the setup
setup(
    name="biokbase",
    packages=find_packages(),
    version="0.0.1",
    install_requires=[s.strip() for s in open("requirements.txt")],
    extras_require={},
    package_data={"": ["*.json"]},
    author="Steve Chan, Dan Gunter, William Riehl",
    author_email="sychan@lbl.gov, dkgunter@lbl.gov, wjriehl@lbl.gov",
    maintainer="Dan Gunter",
    url="https://kbase.us/",
    license="Other",
    description="KBase Python API",
    long_description=long_desc,
    keywords=["kbase", "narrative", "UI"],
    classifiers=[
        "Programming Language :: Python :: 2.7",
        "Development Status :: 4 - Beta",
        "Intended Audience :: Science/Research",
        "Operating System :: OS Independent",
        "Topic :: Scientific/Engineering :: Information Analysis",
        "Topic :: Scientific/Engineering :: Physics",
        "Topic :: Scientific/Engineering :: Chemistry",
        "Topic :: Software Development :: Libraries :: Python Modules"
    ],
    ext_modules=[],
    cmdclass = {
        "doc": BuildDocumentation,
    },
)
